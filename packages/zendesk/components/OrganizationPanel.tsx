import React from "react"
import { NoSupportServices } from "./NoSupportServices"
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
            <NoSupportServices types={organization.services}></NoSupportServices>
            <ImportantContactList importantUsers={organization.importantContacts}></ImportantContactList>
            <OrganizationServices organizationServices={organization.services}></OrganizationServices>
        </>
    )
}