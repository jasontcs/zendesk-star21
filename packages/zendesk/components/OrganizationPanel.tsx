import { ServiceEntity } from "../common/entity"
import { CustomerGuideButton } from "./CustomerGuideButton"
import { ImportantContactTags } from "./ImportantContactTags"
import { OrganizationServices } from "./OrganizationServices"
import { RequesterTitle } from "./RequesterTitle"
import { SpecialRequirements } from "./SpecialRequirements"


type OrganizationPanelProps = {
    requester: string | undefined,
    isVip: boolean,
    userFlags: string[],
    organizationServices: ServiceEntity[],
    guideUrl: string | undefined,
    specialRequirements: string | undefined,
}

export const OrganizationPanel = ({ 
    requester, 
    isVip, 
    userFlags, 
    organizationServices,
    guideUrl, 
    specialRequirements,
}: OrganizationPanelProps) => {
    return (
        <>
            <RequesterTitle requester={requester}></RequesterTitle>
            <ImportantContactTags isVip={isVip} userFlags={userFlags}></ImportantContactTags>
            {specialRequirements && <SpecialRequirements content={specialRequirements}></SpecialRequirements>}
            <OrganizationServices organizationServices={organizationServices}></OrganizationServices>
            <CustomerGuideButton guideUrl={guideUrl}></CustomerGuideButton>
        </>
    )
}