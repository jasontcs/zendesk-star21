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
export interface TicketForm {
    active:               boolean;
    agent_conditions:     AgentCondition[];
    created_at:           Date;
    default:              boolean;
    display_name:         string;
    end_user_conditions:  EndUserCondition[];
    end_user_visible:     boolean;
    id:                   number;
    in_all_brands:        boolean;
    name:                 string;
    position:             number;
    raw_display_name:     string;
    raw_name:             string;
    restricted_brand_ids: number[];
    ticket_field_ids:     number[];
    updated_at:           Date;
    url:                  string;
}

export interface AgentCondition {
    child_fields:    AgentConditionChildField[];
    parent_field_id: number;
    value:           string;
}

export interface AgentConditionChildField {
    id:                   number;
    is_required:          boolean;
    required_on_statuses: RequiredOnStatuses;
}

export interface RequiredOnStatuses {
    statuses?: string[];
    type:      string;
}

export interface EndUserCondition {
    child_fields:    EndUserConditionChildField[];
    parent_field_id: number;
    value:           string;
}

export interface EndUserConditionChildField {
    id:          number;
    is_required: boolean;
}