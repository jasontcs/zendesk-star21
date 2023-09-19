
import zafClient from "../sdk/index";
import { Organization, OrganizationField, TicketForm, User, UserField } from "./http_model";
import { Ticket } from "./api_model";

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
}
