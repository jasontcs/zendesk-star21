
import zafClient from "../sdk/index";
import { Organization, OrganizationField, TicketForm, User, UserField } from "./http_model";
import { IMetadataSettings, OrganizationServiceSetting, Ticket } from "./api_model";
import { PALETTE } from "@zendeskgarden/react-theming";
import { zafConfig, zafUtil } from ".";

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

    async getOrganizationUsers(id: number, tags?: string[]): Promise<User[]> {
        const start = performance.now();
        var nextPage: string | null | undefined = undefined
        var users: User[] = []
        const queries = tags?.map(tag => ` tags:${tag}`).join('') ?? ''

        while (nextPage === undefined || nextPage !== null) {
            const response: any = await zafClient.request<any>(nextPage ?? (`/api/v2/users/search?query=organization:${id}` + queries))
            nextPage = response.next_page
            users = users.concat(response.users)
        }
        const end = performance.now();
        this.logDuration('getOrganizationUsers:' + id, end - start)
        return users
    }

    async getUserTickets(id: number): Promise<Ticket[]> {
        const start = performance.now();
        var nextPage: string | null | undefined = undefined
        var tickets: Ticket[] = []

        while (nextPage === undefined || nextPage !== null) {
            const response: any = await zafClient.request<any>(nextPage ?? (`/api/v2/search.json?query=type:ticket requester:${id} status<solved`))
            nextPage = response.next_page
            tickets = tickets.concat(response.results)
        }
        const end = performance.now();
        this.logDuration('getUserTickets:' + id, end - start)
        return tickets
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
            const fallback = zafConfig.defaultOrganizationsServicesSetting
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
