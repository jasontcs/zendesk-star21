import { ServiceType } from "../common/entity"
import { CustomerGuideButton } from "./CustomerGuideButton"
import { ImportantContactAlert, ImportantContactAlertProvider } from "./ImportantContactAlert"
import { ImportantContactTags } from "./ImportantContactTags"
import { NoSupportServices } from "./NoSupportServices"
import { OrganizationServices } from "./OrganizationServices"
import { RequesterTitle } from "./RequesterTitle"
import { SpecialRequirements } from "./SpecialRequirements"


type OrganizationPanelProps = {
    requester: string | undefined,
    isVip: boolean,
    userFlags: string[],
    organizationServices: ServiceType[],
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
        <ImportantContactAlertProvider>
            <ImportantContactAlert isVip={isVip} isAuthorised={userFlags.length > 0}>
                <RequesterTitle requester={requester}></RequesterTitle>
                <ImportantContactTags isVip={isVip} userFlags={userFlags}></ImportantContactTags>
                {specialRequirements && <SpecialRequirements content={specialRequirements}></SpecialRequirements>}
                <NoSupportServices types={organizationServices}></NoSupportServices>
                <OrganizationServices organizationServices={organizationServices}></OrganizationServices>
                <CustomerGuideButton guideUrl={guideUrl}></CustomerGuideButton>
            </ImportantContactAlert>
        </ImportantContactAlertProvider>
    )
}