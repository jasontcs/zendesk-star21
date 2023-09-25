
export class UserEntity {
    constructor(
        id: number,
        name: string,
        userFlags: UserFlagEntity[],
        organizationId: number,
        specialRequirements: string | undefined,
        specialRequirementsTitle: string,
        requestedTickets: TicketEntity[]
    ) {
        this.id = id
        this.name = name
        this.userFlags = userFlags
        this.organizationId = organizationId
        this.specialRequirements = specialRequirements
        this.specialRequirementsTitle = specialRequirementsTitle
        this.requestedTickets = requestedTickets
    }

    id: number
    name: string
    userFlags: UserFlagEntity[]
    organizationId: number
    specialRequirements?: string
    specialRequirementsTitle: string
    requestedTickets: TicketEntity[]

    get isVip() {
        return this.userFlags.some((flag) => flag.type instanceof UserFlagTypeVip)
    }

    get isAuthorized() {
        return this.userFlags.some((flag) => flag.type instanceof UserFlagTypeAuthorized)
    }
}

export class UserFlagEntity {
    constructor(
        id: number,
        key: string,
        name: string,
        tag: string | undefined,
        type: UserFlagType | undefined,
    ) {
        this.id = id
        this.key = key
        this.name = name
        this.tag = tag
        this.type = type ?? new UserFlagTypeOther()
        if (key == UserFlagTypeVip.key) this.type = new UserFlagTypeVip()
    }
    id: number
    key: string
    name: string
    type: UserFlagType
    tag: string | undefined
}

export abstract class UserFlagType { }

export class UserFlagTypeVip extends UserFlagType {
    static key = 'mms_vip'
}

export class UserFlagTypeAuthorized extends UserFlagType {}

export class UserFlagTypeOther extends UserFlagType { }

export class OrganizationEntity {
    constructor(
        id: number,
        importantContacts: UserEntity[],
        guideUrl: string | undefined,
        services: ServiceType[],
        specialRequirements: string | undefined,
        specialRequirementsTitle: string,
    ) {
        this.id = id
        this.importantContacts = importantContacts
        this.guideUrl = guideUrl
        this.services = services
        this.specialRequirements = specialRequirements
        this.specialRequirementsTitle = specialRequirementsTitle
    }
    id: number
    importantContacts: UserEntity[]
    guideUrl?: string
    services: ServiceType[]
    specialRequirements?: string
    specialRequirementsTitle: string
}

export class ServiceEntity {
    constructor(
        id: number,
        name: string,
        description: string,
    ) {
        this.id = id
        this.name = name
        this.description = description
    }
    id: number
    name: string
    description: string
}
export class ServiceType {
    constructor(
        key: string,
        title: string,
        color: string,
        noService: ServiceEntity | undefined,
        items: ServiceEntity[],
    ) {
        this.key = key
        this.title = title
        this.color = color
        this.noService = noService
        this.items = items
    }
    key: string
    title: string
    color: string
    noService?: ServiceEntity
    items: ServiceEntity[]
}

export class TicketEntity {
    constructor(
        id: number,
        status: TicketStatusType,
        updateAt: Date,
        subject: string,
    ) {
        this.id = id
        this.status = status
        this.updateAt = updateAt
        this.subject = subject
    }
    id: number
    status: TicketStatusType
    updateAt: Date
    subject: string
}

export type TicketStatusType = "new" | "open" | "pending" | "hold" | "solved" | "closed"