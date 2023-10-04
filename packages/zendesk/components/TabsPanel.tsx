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
import { Tabs, TabList, Tab, TabPanel } from '@zendeskgarden/react-tabs';
import { ImportantContactList } from "./ImportantContactList"
import { LG } from "@zendeskgarden/react-typography"
import { zafUtil } from "../common"


type TabsPanelProps = {
    user: UserEntity | undefined,
    organization: OrganizationEntity,
}

const StyledSpacer = styled.div`
  height: ${p => (p.theme as IGardenTheme).space.xxs};
`;

export const TabsPanel = ({
    user,
    organization,
}: TabsPanelProps) => {

    const titleOnClick = () => {
        user && zafClient.invoke('routeTo', 'user', user.id)
    }

    const [selectedTab, setSelectedTab] = React.useState<'organization' | 'user'>(user ? 'user' : 'organization');

    const tabOnChange = ( value: 'organization' | 'user') => {
        setSelectedTab(value)
        zafUtil.resizeWindow()
    }

    return (
        <Tabs selectedItem={selectedTab} onChange={tabOnChange}>
            <TabList style={{ textAlign: 'center' }}>
                <Tab item='user' disabled={!user}><LG isBold>Requester</LG></Tab>
                <Tab item='organization' ><LG isBold>Organisation</LG></Tab>
            </TabList>
            <TabPanel item='organization'>
                <NoSupportServices types={organization.services}></NoSupportServices>
                <ImportantContactList importantUsers={organization.importantContacts}></ImportantContactList>
                <StyledSpacer></StyledSpacer>
                <OrganizationServices organizationServices={organization.services}></OrganizationServices>
                {organization.specialRequirements && <SpecialRequirements title={organization.specialRequirementsTitle} content={organization.specialRequirements}></SpecialRequirements>}
                <CustomerGuideButton guideUrl={organization.guideUrl}></CustomerGuideButton>
            </TabPanel>
            <TabPanel item='user'>
                {user &&
                    <ImportantContactAlert user={user}>
                        <RequesterTitle requester={user.name}></RequesterTitle>
                        <StyledSpacer></StyledSpacer>
                        <StyledSpacer></StyledSpacer>
                        <RequesterTicketCounter tickets={user.requestedTickets} titleOnClick={titleOnClick}></RequesterTicketCounter>
                        <ImportantContactTags isVip={user.isVip} userFlags={user.userFlags.filter((flag) => !(flag.type instanceof UserFlagTypeVip))}></ImportantContactTags>
                        {user.specialRequirements && <SpecialRequirements title={user.specialRequirementsTitle} content={user.specialRequirements} important defaultExpanded></SpecialRequirements>}
                    </ImportantContactAlert>
                }
            </TabPanel>
        </Tabs>
    )
}