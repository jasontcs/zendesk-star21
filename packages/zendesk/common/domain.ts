import { zafUtil } from ".";
import zafClient from "../sdk/index";
import { IMetadataSettings, Ticket } from "./api_model";
import { ZafData } from "./data";
import { OrganizationEntity, ServiceEntity, ServiceType, TicketEntity, UserEntity, UserFlagEntity, UserFlagTypeAuthorized } from "./entity";
import { UserField } from "./http_model";

const zafData = new ZafData()

export class ZafDomain {
    async getUser(id: number, userFields?: UserField[]): Promise<UserEntity> {
        console.log('getUser id: ' + id + ' started')
        const [
            fields, 
            user, 
            tickets, 
            authorisedFieldKeys,
        ] = await Promise.all([
            userFields ?? zafData.getUserFields(),
            zafData.getUser(id),
            zafData.getUserTickets(id),
            zafData.getAuthorisedFieldKeys(),
        ])
        const specialRequirementsTitle = fields.find((field) => field.key == 'special_requirements')!.title
        const userEntity = new UserEntity(
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
        console.log('getUser id: ' + id + ' finished')
        return userEntity
    }

    async getOrganization(id: number): Promise<OrganizationEntity> {
        console.log('getOrganization id: ' + id + ' started')
        const [
            fields,
            organization,
            rawUsers,
            userFields,
            servicesSettings,
            authorisedFieldKeys,
            organizationFields,
        ] = await Promise.all([
            zafData.getOrganizationFields(),
            zafData.getOrganization(id),
            zafData.getOrganizationUsers(id),
            zafData.getUserFields(),
            zafData.getOrganizationServicesSettings(),
            zafData.getAuthorisedFieldKeys(),
            zafData.getOrganizationFields(),
        ])
        const userSpecialRequirementsTitle = userFields.find((field) => field.key == 'special_requirements')!.title
        const organizationSpecialRequirementsTitle = organizationFields.find((field) => field.key == 'special_requirements')!.title
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
            userSpecialRequirementsTitle,
            [],
        ))

        const organizationEntity = new OrganizationEntity(
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
                    return field && field?.key == setting.no_support_field_key ?
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
            ),
            organization.organization_fields['special_requirements'],
            organizationSpecialRequirementsTitle,
        )
        console.log('getOrganization id: ' + id + ' finished')
        return organizationEntity
    }
}

zafClient.on('ticket.save', async function () {
    const ticket: Ticket = await zafClient.get('ticket').then((r: any) => r.ticket)

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

    const isStar21 = organization.id == yourOrganization
    const isInternalForm = whitelistedInternalForms.includes(form.id)
    const isAdmin = adminID.includes(agent.user.id)
    const isBlockedForms = blockedForms.includes(form.id)
    const isBlockedOrg = blockedOrgs.includes(organization.id)

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

});