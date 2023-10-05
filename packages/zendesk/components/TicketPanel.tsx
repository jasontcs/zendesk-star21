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
import { ConditonalWrapper } from "./ConditonalWrapper"
import { AppLoader } from "."


type TicketPanelProps = {
    userName?: string,
    user?: UserEntity,
    organization?: OrganizationEntity,
}

const StyledSpacer = styled.div`
  height: ${p => (p.theme as IGardenTheme).space.xxs};
`;

export const TicketPanel = ({
    userName,
    user,
    organization,
}: TicketPanelProps) => {

    const titleOnClick = () => {
        user && zafClient.invoke('routeTo', 'user', user.id)
    }

    return (
        <>
            <RequesterTitle requester={userName ?? user?.name} />
            <StyledSpacer />
            <hr style={{ margin: 0 }} />
            <StyledSpacer />


            <ConditonalWrapper
                condition={!!user}
                wrapper={children =>
                    <ImportantContactAlert user={user!}>
                        {children}
                    </ImportantContactAlert>}
            >
                {(!user || !organization) && <AppLoader />}
                {user && <RequesterTicketCounter tickets={user.requestedTickets} titleOnClick={titleOnClick} />}
                {organization && <NoSupportServices types={organization.services} />}
                {user && <ImportantContactTags isVip={user.isVip} userFlags={user.userFlags.filter((flag) => !(flag.type instanceof UserFlagTypeVip))} />}
                {organization && <OrganizationServices organizationServices={organization.services} />}
                {user?.specialRequirements && <SpecialRequirements title={user.specialRequirementsTitle} content={user.specialRequirements} important />}
                {organization?.specialRequirements && <SpecialRequirements title={organization.specialRequirementsTitle} content={organization.specialRequirements} />}
            </ConditonalWrapper>
            <CustomerGuideButton guideUrl={organization?.guideUrl} isLoading={!organization} />
        </>
    )
}