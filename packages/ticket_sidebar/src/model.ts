export interface GetTicketResponse {
    errors: Errors;
    ticket: Ticket;
}

export interface Errors {
}

export interface Ticket {
    tags:           string[];
    assignee:       Assignee;
    requester:      Requester;
}

export interface Assignee {
    user:  Requester;
}

export interface Requester {
    name:          string;
    id:            number;
}