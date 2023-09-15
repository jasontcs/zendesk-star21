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


type TicketPanelProps = {
    user: UserEntity,
    organization: OrganizationEntity,
}

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
            <hr />
            <RequesterTicketCounter tickets={user.requestedTickets} titleOnClick={titleOnClick}></RequesterTicketCounter>
            <NoSupportServices types={organization.services}></NoSupportServices>
            <ImportantContactTags isVip={user.isVip} userFlags={user.userFlags.filter((flag) => !(flag.type instanceof UserFlagTypeVip))}></ImportantContactTags>
            <OrganizationServices organizationServices={organization.services}></OrganizationServices>
            {user.specialRequirements && <SpecialRequirements title={user.specialRequirementsTitle} content={user.specialRequirements}></SpecialRequirements>}
            <CustomerGuideButton guideUrl={organization.guideUrl}></CustomerGuideButton>
        </ImportantContactAlert>
    )
}