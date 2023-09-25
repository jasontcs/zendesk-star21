import React from "react"
import { OrganizationEntity, UserEntity, UserFlagTypeVip } from "../common/entity"
import { CustomerGuideButton } from "./CustomerGuideButton"
import { ImportantContactAlert } from "./ImportantContactAlert"
import { ImportantContactTags } from "./ImportantContactTags"
import { NoSupportServices } from "./NoSupportServices"
import { OrganizationServices } from "./OrganizationServices"
import { RequesterTitle } from "./RequesterTitle"
import { SpecialRequirements } from "./SpecialRequirements"
import { RequesterTicketCounter } from "./RequesterTicketsCounter"
import zafClient from "../sdk"
import styled from "styled-components"
import { IGardenTheme } from "@zendeskgarden/react-theming"


type TicketPanelProps = {
    user: UserEntity,
    organization: OrganizationEntity,
}

const StyledSpacer = styled.div`
  height: ${p => (p.theme as IGardenTheme).space.xxs};
`;

export const TicketPanel = ({
    user,
    organization,
}: TicketPanelProps) => {

    const titleOnClick = () => {
        zafClient.invoke('routeTo', 'user', user.id)
    }

    return (
        <ImportantContactAlert user={user}>
            <RequesterTitle requester={user.name}></RequesterTitle>
            <StyledSpacer></StyledSpacer>
            <hr style={{margin: 0}}></hr>
            <StyledSpacer></StyledSpacer>
            <RequesterTicketCounter tickets={user.requestedTickets} titleOnClick={titleOnClick}></RequesterTicketCounter>
            <NoSupportServices types={organization.services}></NoSupportServices>
            <ImportantContactTags isVip={user.isVip} userFlags={user.userFlags.filter((flag) => !(flag.type instanceof UserFlagTypeVip))}></ImportantContactTags>
            <OrganizationServices organizationServices={organization.services}></OrganizationServices>
            {user.specialRequirements && <SpecialRequirements title={user.specialRequirementsTitle} content={user.specialRequirements} important></SpecialRequirements>}
            {organization.specialRequirements && <SpecialRequirements title={organization.specialRequirementsTitle} content={organization.specialRequirements}></SpecialRequirements>}
            <CustomerGuideButton guideUrl={organization.guideUrl}></CustomerGuideButton>
        </ImportantContactAlert>
    )
}