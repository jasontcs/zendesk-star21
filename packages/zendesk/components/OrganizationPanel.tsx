import { NoSupportServices } from "."
import { OrganizationEntity } from "../common/entity"
import { ImportantContactList } from "./ImportantContactList"
import { OrganizationServices } from "./OrganizationServices"


type OrganizationPanelProps = {
    organization: OrganizationEntity,
}

export const OrganizationPanel = ({
    organization,
}: OrganizationPanelProps) => {
    return (
        <>
            <ImportantContactList importantUsers={organization.importantContacts}></ImportantContactList>
            <p></p>
            <NoSupportServices types={organization.services}></NoSupportServices>
            <OrganizationServices organizationServices={organization.services}></OrganizationServices>
        </>
    )
}