export class UserEntity {
    constructor (
        id: number, 
        name: string, 
        userFlags: UserFlagEntity[],
        organizationId: number,
    ) {
        this.id = id
        this.name = name
        this.userFlags = userFlags
        this.organizationId = organizationId
    }

    id: number
    name: string
    userFlags: UserFlagEntity[]
    organizationId: number

    get isVip() {
        return this.userFlags.some((flag) => flag.type instanceof UserFlagTypeVip)
    } 

    get isAuthorized() {
        return this.userFlags.some((flag) => flag.type instanceof UserFlagTypeAuthorized)
    }
}

export class UserFlagEntity {
    constructor (
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

export abstract class UserFlagType {}

export class UserFlagTypeVip extends UserFlagType {
    static key = 'mms_vip'
}

export class UserFlagTypeAuthorized extends UserFlagType {
    static prefix = 'auth_'
}

export class UserFlagTypeOther extends UserFlagType {}

export class OrganizationEntity {
    constructor (
        id: number,
        services: ServiceEntity[],
        importantContacts: UserEntity[],
        guideUrl: string
    ) {
        this.id = id
        this.services = services
        this.importantContacts = importantContacts
        this.guideUrl = guideUrl
    }
    id: number
    services: ServiceEntity[]
    importantContacts: UserEntity[]
    guideUrl: string
}

export class ServiceEntity {
    constructor (
        id: number,
        name: string,
        key: string,
        description: string,
    ) {
        this.id = id
        this.name = name
        this.key = key
        this.description = description
        this.type = ServiceType[description]
    }
    id: number
    name: string
    key: string
    description: string
    type: ServiceType
}

export enum ServiceType {
    managed = "managed",
    mobility = "mobility",
    projects = "projects",
    cloud = "cloud",
}
