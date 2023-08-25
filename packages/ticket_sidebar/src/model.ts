export interface Organization {
    created_at: Date;
    details: string;
    domain_names: string[];
    external_id: string;
    group_id: null;
    id: number;
    name: string;
    notes: string;
    organization_fields: any;
    shared_comments: boolean;
    shared_tickets: boolean;
    tags: string[];
    updated_at: Date;
    url: string;
}

export interface UserField {
    active: boolean;
    created_at: Date;
    description: string;
    id: number;
    key: string;
    position: number;
    raw_description: string;
    raw_title: string;
    regexp_for_validation: null;
    tag: string;
    title: string;
    type: string;
    updated_at: Date;
    url: string;
}

export interface User {
    active: boolean;
    alias: string;
    created_at: Date;
    custom_role_id: number;
    details: string;
    email: string;
    external_id: string;
    iana_time_zone: string;
    id: number;
    last_login_at: Date;
    locale: string;
    locale_id: number;
    moderator: boolean;
    name: string;
    notes: string;
    only_private_comments: boolean;
    organization_id: number;
    phone: string;
    restricted_agent: boolean;
    role: string;
    role_type: number;
    shared: boolean;
    shared_agent: boolean;
    signature: string;
    suspended: boolean;
    tags: string[];
    ticket_restriction: string;
    time_zone: string;
    updated_at: Date;
    url: string;
    verified: boolean;
    user_fields: any;
}

export interface OrganizationField {
    active:                boolean;
    created_at:            Date;
    description:           string;
    id:                    number;
    key:                   string;
    position:              number;
    raw_description:       string;
    raw_title:             string;
    regexp_for_validation: null;
    title:                 string;
    type:                  string;
    updated_at:            Date;
    url:                   string;
}
