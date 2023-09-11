import { OrganizationEntity } from "../common/entity"
import { ImportantContactList } from "./ImportantContactList"


type OrganizationPanelProps = {
    organization: OrganizationEntity,
}

export const OrganizationPanel = ({
    organization,
}: OrganizationPanelProps) => {
    return (
        <ImportantContactList importantUsers={organization.importantContacts} ></ImportantContactList>
    )
}