
import zafClient from "../sdk/index";
import { Organization, OrganizationField, TicketForm, User, UserField } from "./http_model";
import { IMetadataSettings, OrganizationServiceSetting, Ticket } from "./api_model";

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
        var nextPage: string | null | undefined = undefined
        var users: User[] = []
        while (nextPage === undefined || nextPage !== null) {
            const response: any = await zafClient.request<any>(nextPage ?? `/api/v2/organizations/${id}/users`)
            nextPage = response.next_page
            users = users.concat(response.users)
        }
        return users
    }

    async getUserTickets(id: number): Promise<Ticket[]> {
        const response = await zafClient.request<any>(`/api/v2/users/${id}/tickets/requested`)
        return response.tickets
    }

    async getTicketForm(id: number): Promise<TicketForm> {
        const response = await zafClient.request<any>(`/api/v2/ticket_forms/${id}`)
        return response.ticket_form
    }

    async getOrganizationServicesSettings(): Promise<OrganizationServiceSetting[]> {
        const settings = await this.getMetaData()

        try {
            if (settings?.organizations_services_setting) {
                const results: OrganizationServiceSetting[] = JSON.parse(settings!.organizations_services_setting)
                return results;
            }
        } finally {
            const fallback = "[\r\n   {\r\n      \"key\": \"managed\",\r\n      \"title\": \"Managed\",\r\n      \"color\": \"red\",\r\n      \"no_support_field_key\": \"mdm\"\r\n   },\r\n   {\r\n      \"key\": \"mobility\",\r\n      \"title\": \"Mobility\",\r\n      \"color\": \"black\",\r\n      \"no_support_field_key\": \"mobile_no_support\"\r\n   },\r\n   {\r\n      \"key\": \"projects\",\r\n      \"title\": \"Projects\",\r\n      \"color\": \"green\",\r\n      \"no_support_field_key\": null\r\n   },\r\n   {\r\n      \"key\": \"tco\",\r\n      \"title\": \"Cloud\",\r\n      \"color\": \"blue\",\r\n      \"no_support_field_key\": \"tco_no_support\"\r\n   },\r\n   {\r\n      \"key\": \"m365\",\r\n      \"title\": \"Cloud\",\r\n      \"color\": \"blue\",\r\n      \"no_support_field_key\": \"o365_no_support\"\r\n   },\r\n   {\r\n      \"key\": \"teams_room\",\r\n      \"title\": \"Cloud\",\r\n      \"color\": \"blue\",\r\n      \"no_support_field_key\": \"teams_room_no_support\"\r\n   }\r\n]"
            return JSON.parse(fallback)
        }
    }

    async getAuthorisedFieldKeys(): Promise<string[]> {
        const settings = await this.getMetaData()
        return settings?.authorised_field_keys.split(',') ?? []
    }

    async getMetaData(): Promise<IMetadataSettings | undefined> {
        const settings = await zafClient.metadata<IMetadataSettings>()
        return settings.settings
    }
}
