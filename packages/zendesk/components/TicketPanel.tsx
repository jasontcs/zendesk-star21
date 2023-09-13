import React from "react"
import { OrganizationEntity, UserEntity, UserFlagTypeVip } from "../common/entity"
import { CustomerGuideButton } from "./CustomerGuideButton"
import { ImportantContactAlert } from "./ImportantContactAlert"
import { ImportantContactTags } from "./ImportantContactTags"
import { NoSupportServices } from "./NoSupportServices"
import { OrganizationServices } from "./OrganizationServices"
import { RequesterTitle } from "./RequesterTitle"
import { SpecialRequirements } from "./SpecialRequirements"


type TicketPanelProps = {
    user: UserEntity,
    organization: OrganizationEntity,
}

export const TicketPanel = ({
    user,
    organization,
}: TicketPanelProps) => {
    return (
        <ImportantContactAlert user={user}>
            <RequesterTitle requester={user.name} tickets={user.requestedTickets}></RequesterTitle>
            <ImportantContactTags isVip={user.isVip} userFlags={user.userFlags.filter((flag) => !(flag.type instanceof UserFlagTypeVip))}></ImportantContactTags>
            {user.specialRequirements && <SpecialRequirements content={user.specialRequirements}></SpecialRequirements>}
            <NoSupportServices types={organization.services}></NoSupportServices>
            <OrganizationServices organizationServices={organization.services}></OrganizationServices>
            <CustomerGuideButton guideUrl={organization.guideUrl}></CustomerGuideButton>
        </ImportantContactAlert>
    )
}