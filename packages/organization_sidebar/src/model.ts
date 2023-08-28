export interface GetOrganizationResponse {
    errors:       Errors;
    organization: Organization;
}

export interface Errors {
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
