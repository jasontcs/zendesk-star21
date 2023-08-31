import zafClient from "../sdk/index";
import { IMetadataSettings, Ticket } from "./api_model";
import { ZafData } from "./data";
import { OrganizationEntity, ServiceEntity, UserEntity, UserFlagEntity } from "./entity";
import { UserField } from "./http_model";

const zafData = new ZafData()

export class ZafDomain {
    async getUser(id: number, userFields?: UserField[]): Promise<UserEntity> {
        const fields = userFields ?? await zafData.getUserFields()
        const user = await zafData.getUser(id)
        return new UserEntity(
            user.id,
            user.name,
            user.tags.flatMap(
                (tag) => {
                    const field = fields.find((field) => field.tag == tag)
                    return field
                        ? [new UserFlagEntity(
                            field.id,
                            field.tag,
                            field.title,
                        )]
                        : []
                }
            ),
            user.organization_id
        )
    }

    async getOrganization(id: number): Promise<OrganizationEntity> {
        const fields = await zafData.getOrganizationFields()
        const organization = await zafData.getOrganization(id)
        const rawUsers = await zafData.getOrganizationUsers(id)
        const userFields = await zafData.getUserFields()
        const users = rawUsers.map((user) => new UserEntity(
            user.id,
            user.name,
            user.tags.flatMap(
                (tag) => {
                    const field = userFields.find((field) => field.tag == tag)
                    return field
                        ? [new UserFlagEntity(
                            field.id,
                            field.tag,
                            field.title,
                        )]
                        : []
                }
            ),
            user.organization_id
        ))
        return new OrganizationEntity(
            organization.id,
            organization.tags.flatMap(
                (tag) => {
                    const field = fields.find((field) => field.tag == tag)
                    return field
                        ? [new ServiceEntity(
                            field.id,
                            field.title,
                            field.key,
                            field.description,
                        )]
                        : []
                }
            ),
            users.filter((user) => user.isVip || user.isAuthorized),
            organization.organization_fields['guide_url'],
        )
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

    if (!isStar21 && isInternalForm) {
        if (isAdmin) {
            zafClient.invoke('notify', ["Validation Override\nBypassed: Star21 requesters can only submit on a Internal IT Form", "error", 20000])
            return true
        }
        return 'This form can only be used for requesters that are Star21 employees'
    }

    if (isBlockedOrg) {
        if (isAdmin) {
            zafClient.invoke('notify', ["Validation Override\nBypassed: You cannot solve this ticket under this organisation.", "error", 20000])
            return true
        }
        return 'You cannot solve this ticket under this organisation. Please select the correct organisation in the dropdown on the left!'
    }

    if (isBlockedForms) {
        if (isAdmin) {
            zafClient.invoke('notify', ["Validation Override\nBypassed: You can not solve on this form. Please select the correct form", "error", 20000])
            return true
        }
        return 'You can not solve on this form. Please select the correct form'
    }

    return true

});