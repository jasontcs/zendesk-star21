
export class UserEntity {
    constructor(
        id: number,
        name: string,
        userFlags: UserFlagEntity[],
        organizationId: number,
        specialRequirements: string | undefined,
    ) {
        this.id = id
        this.name = name
        this.userFlags = userFlags
        this.organizationId = organizationId
        this.specialRequirements = specialRequirements
    }

    id: number
    name: string
    userFlags: UserFlagEntity[]
    organizationId: number
    specialRequirements?: string

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
    ) {
        this.id = id
        this.key = key
        this.name = name
        if (key == UserFlagTypeVip.key) this.type = new UserFlagTypeVip()
        else if (key.startsWith(UserFlagTypeAuthorized.prefix)) this.type = new UserFlagTypeAuthorized()
        else this.type = new UserFlagTypeOther()
    }
    id: number
    key: string
    name: string
    type: UserFlagType
}

export abstract class UserFlagType { }

export class UserFlagTypeVip extends UserFlagType {
    static key = 'mms_vip'
}

export class UserFlagTypeAuthorized extends UserFlagType {
    static prefix = 'auth_'
}

export class UserFlagTypeOther extends UserFlagType { }

export class OrganizationEntity {
    constructor(
        id: number,
        importantContacts: UserEntity[],
        guideUrl: string | undefined,
        services: ServiceType[],
    ) {
        this.id = id
        this.importantContacts = importantContacts
        this.guideUrl = guideUrl
        this.services = services
    }
    id: number
    importantContacts: UserEntity[]
    guideUrl?: string
    services: ServiceType[]
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
