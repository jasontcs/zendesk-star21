import zafClient from "@app/zendesk/sdk";
import { Organization, OrganizationField, User, UserField } from "./model";

export async function getUserFields(): Promise<UserField[]> {
    const response = await zafClient.request<any>(`/api/v2/user_fields`)
    return response.user_fields
}

export async function getUser(id: number): Promise<User> {
    const response = await zafClient.request<any>(`/api/v2/users/${id}`)
    return response.user
}

export async function getOrganizationFields(): Promise<OrganizationField[]> {
    const response = await zafClient.request<any>(`/api/v2/organization_fields`)
    return response.organization_fields
}

export async function getOrganization(id: number): Promise<Organization> {
    const response = await zafClient.request<any>(`/api/v2/organizations/${id}`)
    return response.organization
}