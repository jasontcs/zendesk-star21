
import zafClient from "../sdk/index";
import { zafConfig as zafConfig } from "./index";
import { Organization, OrganizationField, User, UserField } from "./model";

export class ZafData {
    async getUserFields(): Promise<UserField[]> {
        const response = await zafClient.request<any>(`/api/v2/user_fields`)
        return response.user_fields
    }

    async getUser(id: number): Promise<User> {
        const response = await zafClient.request<any>(`/api/v2/users/${id}`)
        return response.user
    }

    async getOrganizationFields(): Promise<OrganizationField[]> {
        const response = await zafClient.request<any>(`/api/v2/organization_fields`)
        return response.organization_fields
    }

    async getOrganization(id: number): Promise<Organization> {
        const response = await zafClient.request<any>(`/api/v2/organizations/${id}`)
        return response.organization
    }

    async getOrganizationUsers(id: number): Promise<User[]> {
        const response = await zafClient.request<any>(`/api/v2/organizations/${id}/users`)
        return response.users
    }

    isVip(user: User): boolean {
        return user.user_fields[zafConfig.vipKey]
    }

    isAuthorized(user: User): boolean {
        return Object.entries(user.user_fields).some((f) => f[0].startsWith(zafConfig.authPrefix))
    }

}
