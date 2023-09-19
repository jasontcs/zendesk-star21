import zafClient from "../sdk/index";
import { IMetadataSettings, OrganizationServiceSetting, Ticket } from "./api_model";
import { ZafData } from "./data";
import { OrganizationEntity, ServiceEntity, ServiceType, TicketEntity, UserEntity, UserFlagEntity, UserFlagTypeAuthorized } from "./entity";
import { UserField } from "./http_model";

const zafData = new ZafData()

export class ZafDomain {
    async getUser(id: number, userFields?: UserField[]): Promise<UserEntity> {
        const fields = userFields ?? await zafData.getUserFields()
        const user = await zafData.getUser(id)
        const tickets = await zafData.getUserTickets(id)
        const specialRequirementsTitle = fields.find((field) => field.key == 'special_requirements')!.title
        const authorisedFieldKeys = await this.getAuthorisedFieldKeys()
        return new UserEntity(
            user.id,
            user.name,
            user.tags.flatMap(
                (tag) => {
                    const field = fields.find((field) => field.tag == tag)
                    return field
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
            tickets.map(
                (ticket) => {
                    return new TicketEntity(
                        ticket.id,
                        ticket.status as "new" | "open" | "pending" | "hold" | "solved" | "closed",
                        new Date(ticket.updated_at),
                        ticket.subject,
                    )
                }
            )
        )
    }

    async getOrganization(id: number): Promise<OrganizationEntity> {
        const fields = await zafData.getOrganizationFields()
        const organization = await zafData.getOrganization(id)
        const rawUsers = await zafData.getOrganizationUsers(id)
        const userFields = await zafData.getUserFields()
        const servicesSettings = await this.getOrganizationServicesSettings()
        const specialRequirementsTitle = userFields.find((field) => field.key == 'special_requirements')!.title
        const authorisedFieldKeys = await this.getAuthorisedFieldKeys()
        const users = rawUsers.map((user) => new UserEntity(
            user.id,
            user.name,
            user.tags.flatMap(
                (tag) => {
                    const field = userFields.find((field) => field.tag == tag)
                    return field
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
            [],
        ))
        return new OrganizationEntity(
            organization.id,
            users.filter((user) => user.isVip || user.isAuthorized),
            organization.organization_fields['guide_url'],
            servicesSettings.map((setting) => new ServiceType(
                setting.key,
                setting.title,
                setting.color,
                organization.tags.reduce<ServiceEntity | undefined>((previous, current) => {
                    if (previous) return previous
                    const field = fields.find((field) => field.tag == current)
                    return field?.key == setting.no_support_field_key ?
                        new ServiceEntity(field.id, field.title, field.description) : undefined
                }, undefined),
                organization.tags
                    .flatMap(
                        (tag) => {
                            const field = fields.find((field) => field.tag == tag)
                            return setting.key == field?.description
                                ? [new ServiceEntity(
                                    field.id,
                                    field.title,
                                    field.description,
                                )]
                                : []
                        }
                    )
            ),
            )
        )
    }

    private async getOrganizationServicesSettings(): Promise<OrganizationServiceSetting[]> {
        const settings = await zafClient.metadata<IMetadataSettings>()
        return settings.settings?.organizations_services_setting ? JSON.parse(settings.settings!.organizations_services_setting) : []
    }

    private async getAuthorisedFieldKeys(): Promise<string[]> {
        const settings = await zafClient.metadata<IMetadataSettings>()
        return settings.settings?.authorised_field_keys.split(',') ?? []
    }
}

zafClient.on('ticket.save', async function () {
    const ticket: Ticket = await zafClient.get('ticket').then((r: any) => r.ticket)

    if (ticket.status !== 'solved') return Promise.resolve(true)

    const agent = ticket.assignee
    const form = await zafData.getTicketForm(ticket.form.id)
    const organization = ticket.organization
    const settings = await zafClient.metadata<IMetadataSettings>()

    const yourOrganization = Number(settings.settings?.yourOrganization)
    const whitelistedInternalForms = settings.settings?.whitelistedInternalForms?.split(',').map((e) => Number(e)) ?? []
    const blockedForms = settings.settings?.blockedForms?.split(',').map((e) => Number(e)) ?? []
    const blockedOrgs = settings.settings?.blockedOrgs?.split(',').map((e) => Number(e)) ?? []
    const adminID = settings.settings?.adminOverrideID?.split(',').map((e) => Number(e)) ?? []

    const isStar21 = organization.id == yourOrganization
    const isInternalForm = whitelistedInternalForms.includes(form.id)
    const isAdmin = adminID.includes(agent.user.id)
    const isBlockedForms = blockedForms.includes(form.id)
    const isBlockedOrg = blockedOrgs.includes(organization.id)

    console.log('isStar21', isStar21)
    console.log('isInternalForm', isInternalForm)
    console.log('isAdmin', isAdmin)
    console.log('isBlockedForms', isBlockedForms)
    console.log('isBlockedOrg', isBlockedOrg)

    const showError = async <U>(message: string) => {
        return await zafClient.invoke<U>('notify', message, 'error', 20000)
    }

    if (!isStar21 && isInternalForm) {
        if (isAdmin) {
            showError("Validation Override\nBypassed: Star21 requesters can only submit on a Internal IT Form")
            return true
        }
        return 'This form can only be used for requesters that are Star21 employees'
    }

    if (isBlockedOrg) {
        if (isAdmin) {
            showError("Validation Override\nBypassed: You cannot solve this ticket under this organisation.")
            return true
        }
        return 'You cannot solve this ticket under this organisation. Please select the correct organisation in the dropdown on the left!'
    }

    if (isBlockedForms) {
        if (isAdmin) {
            showError("Validation Override\nBypassed: You can not solve on this form. Please select the correct form")
            return true
        }
        return 'You can not solve on this form. Please select the correct form'
    }

    return true

});