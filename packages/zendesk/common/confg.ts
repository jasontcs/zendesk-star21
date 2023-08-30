import { ServiceType } from "./entity"

export class ZafConfig {
    vipKey = 'mms_vip'
    authPrefix = 'auth_'
    
    typeColor = (type: ServiceType): string => {
        switch (type) {
            case ServiceType.managed: return 'red'
            case ServiceType.mobility: return 'black'
            case ServiceType.projects: return 'green'
            case ServiceType.cloud: return 'blue'
        }
    }
    typeTitle = (type: ServiceType): string => {
        switch (type) {
            case ServiceType.managed: return 'Managed'
            case ServiceType.mobility: return 'Mobility'
            case ServiceType.projects: return 'Projects'
            case ServiceType.cloud: return 'Cloud'
        }

    }
}


