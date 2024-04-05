import { zafUtil } from ".";
import zafClient from "../sdk/index";
import { IMetadataSettings, OrganizationServiceSetting, Ticket } from "./api_model";
import { ZafData } from "./data";
import { OrganizationEntity, ServiceEntity, ServiceType, TicketEntity, UserEntity, UserFlagEntity, UserFlagTypeAuthorized, UserFlagTypeVip } from "./entity";
import { OrganizationField, User, UserField } from "./http_model";

const zafData = new ZafData()

export class ZafDomain {
    async getUser(id: number, prep?: { userFields?: UserField[], authorisedFieldKeys?: string[] }) {
        const [
            fields,
            user,
            tickets,
            _authorisedFieldKeys,
        ] = await Promise.all([
            prep?.userFields ?? zafData.getUserFields(),
            zafData.getUser(id),
            // zafData.getUserTickets(id),
            undefined,
            prep?.authorisedFieldKeys ?? zafData.getAuthorisedFieldKeys(),
        ])
        const specialRequirementsTitle = fields.find((field) => field.key == 'special_requirements')!.title
        const userEntity = this.getUserEntity(user, fields, _authorisedFieldKeys, specialRequirementsTitle, tickets)
        return { userEntity, userFields: fields, authorisedFieldKeys: _authorisedFieldKeys, }
    }

    async patchUserActiveTickets(user: UserEntity): Promise<UserEntity> {
        const [
            tickets,
        ] = await Promise.all([
            zafData.getUserActiveTickets(user.id),
        ])
        return new UserEntity(
            user.id,
            user.name,
            user.userFlags,
            user.organizationId,
            user.specialRequirements,
            user.specialRequirementsTitle,
            this.getTicketEntities(tickets),
        )
    }

    async getOrganization(id: number, prep?: { fields?: OrganizationField[], userFields?: UserField[], servicesSettings?: OrganizationServiceSetting[], authorisedFieldKeys?: string[] }) {
        const [
            _authorisedFieldKeys,
            _userFields,
        ] = await Promise.all([
            prep?.authorisedFieldKeys ?? await zafData.getAuthorisedFieldKeys(),
            prep?.userFields ?? zafData.getUserFields(),
        ])

        const keys = [UserFlagTypeVip.key, ..._authorisedFieldKeys].map(key => _userFields.find(field => field.key == key)!.tag)
        const [
            _fields,
            organization,
            rawUsers,
            _servicesSettings,
        ] = await Promise.all([
            prep?.fields ?? zafData.getOrganizationFields(),
            zafData.getOrganization(id),
            zafData.getOrganizationUsers(id, keys),
            prep?.servicesSettings ?? zafData.getOrganizationServicesSettings(),
        ])
        const userSpecialRequirementsTitle = _userFields.find((field) => field.key == 'special_requirements')!.title
        const organizationSpecialRequirementsTitle = _fields.find((field) => field.key == 'special_requirements')!.title
        const users = rawUsers.map((user) => this.getUserEntity(user, _userFields, _authorisedFieldKeys, userSpecialRequirementsTitle, []))

        const organizationEntity = new OrganizationEntity(
            organization.id,
            users.filter((user) => user.isVip || user.isAuthorized),
            organization.organization_fields['guide_url'],
            _servicesSettings.map((setting) => new ServiceType(
                setting.key,
                setting.title,
                setting.color,
                Object.entries(organization.organization_fields)
                    .filter(e => typeof e[1] == 'boolean')
                    .reduce<ServiceEntity | undefined>((previous, current) => {
                        if (previous) return previous
                        const field = _fields.find((field) => field.key == current[0])
                        return field && current[1] === true && field?.key == setting.no_support_field_key ?
                            new ServiceEntity(field.id, field.title, field.description) : undefined
                    }, undefined),

                _fields
                    .filter(field => {
                        return field.type == 'checkbox'
                            && Object.entries(organization.organization_fields).find(e => e[0] == field.key && e[1] === true)
                            && setting.key == field?.description
                    })
                    .map(field => new ServiceEntity(
                        field.id,
                        field.title,
                        field.description,
                    ))
            ),
            ),
            organization.organization_fields['special_requirements'],
            organizationSpecialRequirementsTitle,
        )
        return { organizationEntity, fields: _fields, userFields: _userFields, servicesSettings: _servicesSettings, authorisedFieldKeys: _authorisedFieldKeys }
    }

    async getCurrentTicket() {
        const ticket: Ticket = await zafClient.get('ticket').then((r: any) => r.ticket)
        return ticket
    }

    async ticketOnSave() {
        const ticket = await this.getCurrentTicket()
        if (ticket.status !== 'solved') return true

        const agent = ticket.assignee
        const organization = ticket.organization
        const [
            form,
            settings,
        ] = await Promise.all([
            zafData.getTicketForm(ticket.form.id),
            zafClient.metadata<IMetadataSettings>(),
        ])

        const yourOrganization = Number(settings.settings?.yourOrganization)
        const whitelistedInternalForms = settings.settings?.whitelistedInternalForms?.split(',').map((e) => Number(e)) ?? []
        const blockedForms = settings.settings?.blockedForms?.split(',').map((e) => Number(e)) ?? []
        const blockedOrgs = settings.settings?.blockedOrgs?.split(',').map((e) => Number(e)) ?? []
        const adminID = settings.settings?.adminOverrideID?.split(',').map((e) => Number(e)) ?? []

        const isStar21 = organization?.id == yourOrganization
        const isInternalForm = whitelistedInternalForms.includes(form.id)
        const isAdmin = agent.user && adminID.includes(agent.user.id)
        const isBlockedForms = blockedForms.includes(form.id)
        const isBlockedOrg = organization?.id ? blockedOrgs.includes(organization.id) : false

        if (!organization) {
            if (isAdmin) {
                zafUtil.showToast("Validation Override\nBypassed: No organisation selected", 'error')
                return true
            }
            return 'No organisation selected, please update the requester or add an Organisation to the requester'
        }

        if (!isStar21 && isInternalForm) {
            if (isAdmin) {
                zafUtil.showToast("Validation Override\nBypassed: Star21 requesters can only submit on a Internal IT Form", 'error')
                return true
            }
            return 'This form can only be used for requesters that are Star21 employees'
        }

        if (isBlockedOrg) {
            if (isAdmin) {
                zafUtil.showToast("Validation Override\nBypassed: You cannot solve this ticket under this organisation.", 'error')
                return true
            }
            return 'You cannot solve this ticket under this organisation. Please select the correct organisation in the dropdown on the left!'
        }

        if (isBlockedForms) {
            if (isAdmin) {
                zafUtil.showToast("Validation Override\nBypassed: You can not solve on this form. Please select the correct form", 'error')
                return true
            }
            return 'You can not solve on this form. Please select the correct form'
        }

        return true
    }

    private getUserEntity(user: User, userFields: UserField[], authorisedFieldKeys: string[], specialRequirementsTitle: string, tickets: Ticket[] | undefined) {
        const userEntity = new UserEntity(
            user.id,
            user.name,
            Object.entries(user.user_fields)
                .filter(e => typeof e[1] == 'boolean')
                .flatMap(
                    (e) => {
                        const field = userFields.find((field) => field.key == e[0])
                        return field && e[1] === true
                            ? [new UserFlagEntity(
                                field.id,
                                field.key,
                                field.title,
                                field.tag,
                                authorisedFieldKeys.includes(field.key) ? new UserFlagTypeAuthorized() : undefined
                            )]
                            : []
                    }
                ),
            user.organization_id,
            user.user_fields['special_requirements'],
            specialRequirementsTitle,
            this.getTicketEntities(tickets),
        )
        return userEntity
    }

    private getTicketEntities(tickets: Ticket[] | undefined) {
        if (!tickets) return undefined
        return tickets.map(
            (ticket) => {
                return new TicketEntity(
                    ticket.id,
                    ticket.status as "new" | "open" | "pending" | "hold" | "solved" | "closed",
                    new Date(ticket.updated_at),
                    ticket.subject,
                )
            }
        )
    }
}