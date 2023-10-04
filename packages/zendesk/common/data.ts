
import zafClient from "../sdk/index";
import { Organization, OrganizationField, TicketForm, User, UserField } from "./http_model";
import { IMetadataSettings, OrganizationServiceSetting, Ticket } from "./api_model";
import { PALETTE } from "@zendeskgarden/react-theming";
import { zafUtil } from ".";

export class ZafData {

    private logDuration(message: string, duration: number) {
        const time = (Math.round(duration / 1000 * 100) / 100).toFixed(2);
        console.log(message, time)
    }

    async getUserFields(): Promise<UserField[]> {
        const start = performance.now();
        const response = await zafClient.request<any>(`/api/v2/user_fields`)
        const end = performance.now();
        this.logDuration('getUserFields', end - start)
        return response.user_fields
    }

    async getUser(id: number): Promise<User> {
        const start = performance.now();
        const response = await zafClient.request<any>(`/api/v2/users/${id}`)
        const end = performance.now();
        this.logDuration('getUser:' + id, end - start)
        return response.user
    }

    async getOrganizationFields(): Promise<OrganizationField[]> {
        const start = performance.now();
        const response = await zafClient.request<any>(`/api/v2/organization_fields`)
        const end = performance.now();
        this.logDuration('getOrganizationFields', end - start)
        return response.organization_fields
    }

    async getOrganization(id: number): Promise<Organization> {
        const start = performance.now();
        const response = await zafClient.request<any>(`/api/v2/organizations/${id}`)
        const end = performance.now();
        this.logDuration('getOrganization:' + id, end - start)
        return response.organization
    }

    async getOrganizationUsers(id: number): Promise<User[]> {
        const start = performance.now();
        var nextPage: string | null | undefined = undefined
        var users: User[] = []
        while (nextPage === undefined || nextPage !== null) {
            const response: any = await zafClient.request<any>(nextPage ?? `/api/v2/organizations/${id}/users`)
            nextPage = response.next_page
            users = users.concat(response.users)
        }
        const end = performance.now();
        this.logDuration('getOrganizationUsers:' + id, end - start)
        return users
    }

    async getUserTickets(id: number): Promise<Ticket[]> {
        const start = performance.now();
        const response = await zafClient.request<any>(`/api/v2/users/${id}/tickets/requested`)
        const end = performance.now();
        this.logDuration('getUserTickets:' + id, end - start)
        return response.tickets
    }

    async getTicketForm(id: number): Promise<TicketForm> {
        const start = performance.now();
        const response = await zafClient.request<any>(`/api/v2/ticket_forms/${id}`)
        const end = performance.now();
        this.logDuration('getTicketForm:' + id, end - start)
        return response.ticket_form
    }

    async getOrganizationServicesSettings(): Promise<OrganizationServiceSetting[]> {
        const settings = await this.getMetaData()

        try {
            if (settings?.organizations_services_setting) {
                const results: OrganizationServiceSetting[] = JSON.parse(settings!.organizations_services_setting)
                results.forEach(setting => { 
                    if ( !zafUtil.isColor(setting.color) && !Object.keys(PALETTE).includes(setting.color) )
                    throw Error(`'${setting.color}' is not a valid color`) 
                })
                return results;
            }
            throw new Error('No Setting');
            
        } catch (e) {
            console.error('Organization Service Setting Error: ' + e)
            const fallback = "[\r\n    {\r\n       \"key\": \"managed\",\r\n       \"title\": \"Managed\",\r\n       \"color\": \"red\",\r\n       \"no_support_field_key\": \"mdm\"\r\n    },\r\n    {\r\n       \"key\": \"mobility\",\r\n       \"title\": \"Mobility\",\r\n       \"color\": \"black\",\r\n       \"no_support_field_key\": \"mobile_no_support\"\r\n    },\r\n    {\r\n       \"key\": \"projects\",\r\n       \"title\": \"Projects\",\r\n       \"color\": \"green\",\r\n       \"no_support_field_key\": null\r\n    },\r\n    {\r\n       \"key\": \"tco\",\r\n       \"title\": \"Cloud\",\r\n       \"color\": \"blue\",\r\n       \"no_support_field_key\": \"tco_no_support\"\r\n    },\r\n    {\r\n       \"key\": \"m365\",\r\n       \"title\": \"Cloud\",\r\n       \"color\": \"blue\",\r\n       \"no_support_field_key\": \"o365_no_support\"\r\n    },\r\n    {\r\n       \"key\": \"teams_room\",\r\n       \"title\": \"Cloud\",\r\n       \"color\": \"blue\",\r\n       \"no_support_field_key\": \"teams_room_no_support\"\r\n    },\r\n    {\r\n       \"key\": \"cloud\",\r\n       \"title\": \"Cloud\",\r\n       \"color\": \"blue\",\r\n       \"no_support_field_key\": null\r\n    }\r\n ]"
            return JSON.parse(fallback)
        }
    }

    async getAuthorisedFieldKeys(): Promise<string[]> {
        const settings = await this.getMetaData()
        return settings?.authorised_field_keys.split(',') ?? []
    }

    async getMetaData(): Promise<IMetadataSettings | undefined> {
        const start = performance.now();
        const settings = await zafClient.metadata<IMetadataSettings>()
        const end = performance.now();
        this.logDuration('getMetaData', end - start)
        return settings.settings
    }
}
