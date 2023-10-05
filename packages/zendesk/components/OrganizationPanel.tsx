import React from "react"
import { NoSupportServices } from "./NoSupportServices"
import { OrganizationEntity } from "../common/entity"
import { ImportantContactList } from "./ImportantContactList"
import { OrganizationServices } from "./OrganizationServices"
import styled from "styled-components"
import { IGardenTheme } from "@zendeskgarden/react-theming"


type OrganizationPanelProps = {
    organization: OrganizationEntity,
}

const StyledSpacer = styled.div`
  height: ${p => (p.theme as IGardenTheme).space.xxs};
`;

export const OrganizationPanel = ({
    organization,
}: OrganizationPanelProps) => {
    return (
        <>
            <NoSupportServices types={organization.services} />
            <ImportantContactList importantUsers={organization.importantContacts} />
            <StyledSpacer />
            <OrganizationServices organizationServices={organization.services} />
        </>
    )
}