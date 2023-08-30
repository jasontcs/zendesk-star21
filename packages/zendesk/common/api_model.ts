export interface GetTicketResponse {
    errors: Errors;
    ticket: Ticket;
}

export interface Errors {
}

export interface Ticket {
    tags:           string[];
    assignee:       Assignee;
    requester:      User;
    status:         string;
    form:           Form;
    organization:   Organization;
}

export interface Assignee {
    user:  User;
}

export interface User {
    name:          string;
    id:            number;
}

export interface Form {
    id: number;
}

export interface GetOrganizationResponse {
    errors:       Errors;
    organization: Organization;
}

export interface Organization {
    id:                 number;
    tags:               string[];
    name:               string;
    domains:            string;
    details:            string;
    notes:              string;
    sharedTickets:      boolean;
    sharedComments:     boolean;
    organizationFields: any;
}

export interface IMetadataSettings {
    adminOverrideID?: string;
    blockedForms?: string;
    blockedOrgs?: string;
    title?: string;
    whitelistedInternalForms?: string;
    yourOrganization?: string;
}
