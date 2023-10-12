export interface GetTicketResponse {
    errors: Errors;
    ticket: Ticket;
}

export interface Errors {
}

export interface Ticket {
    id:             number;
    tags:           string[];
    assignee:       Assignee;
    requester:      User;
    status:         string;
    form:           Form;
    organization:   Organization;
    updated_at:     string;
    subject:        string;
}

export interface Assignee {
    user?:  User;
}

export interface User {
    name:          string;
    id:            number;
    tags:          string[];
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
    organizations_services_setting: string;
    authorised_field_keys: string;
}

export interface OrganizationServiceSetting {
    key: string;
    title: string;
    color: string;
    no_support_field_key: string | undefined;
}

export interface GetUserResponse {
    errors: Errors;
    user:   User;
}
