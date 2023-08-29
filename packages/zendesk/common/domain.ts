import { ZafData } from "./data";
import { OrganizationEntity, ServiceEntity, UserEntity, UserFlagEntity } from "./entity";
import { UserField } from "./model";

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
        const userFields =  await zafData.getUserFields()
        const users = await Promise.all(rawUsers.map((user) => this.getUser(user.id, userFields)))
        return new OrganizationEntity(
            organization.id,
            organization.tags.flatMap(
                (tag) => {
                    const field = fields.find((field) => field.key == tag)
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