import { OrganizationEntity, UserEntity, UserFlagTypeVip } from "../common/entity"
import { CustomerGuideButton } from "./CustomerGuideButton"
import { ImportantContactAlert, ImportantContactAlertProvider } from "./ImportantContactAlert"
import { ImportantContactTags } from "./ImportantContactTags"
import { NoSupportServices } from "./NoSupportServices"
import { OrganizationServices } from "./OrganizationServices"
import { RequesterTitle } from "./RequesterTitle"
import { SpecialRequirements } from "./SpecialRequirements"


type OrganizationPanelProps = {
    user: UserEntity,
    organization: OrganizationEntity,
}

export const OrganizationPanel = ({
    user,
    organization,
}: OrganizationPanelProps) => {
    return (
        <ImportantContactAlertProvider>
            <ImportantContactAlert isVip={user.isVip} isAuthorised={user.userFlags.length > 0}>
                <RequesterTitle requester={user.name}></RequesterTitle>
                <ImportantContactTags isVip={user.isVip} userFlags={user.userFlags.filter((flag) => !(flag.type instanceof UserFlagTypeVip))}></ImportantContactTags>
                {user.specialRequirements && <SpecialRequirements content={user.specialRequirements}></SpecialRequirements>}
                <NoSupportServices types={organization.services}></NoSupportServices>
                <OrganizationServices organizationServices={organization.services}></OrganizationServices>
                <CustomerGuideButton guideUrl={organization.guideUrl}></CustomerGuideButton>
            </ImportantContactAlert>
        </ImportantContactAlertProvider>
    )
}