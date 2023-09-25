import React from "react"
import { NoSupportServices } from "./NoSupportServices"
import { OrganizationEntity } from "../common/entity"
import { ImportantContactList } from "./ImportantContactList"
import { OrganizationServices } from "./OrganizationServices"
import { Accordion } from '@zendeskgarden/react-accordions';
import { zafUtil } from "../common"
import { Well } from "@zendeskgarden/react-notifications"
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
            <NoSupportServices types={organization.services}></NoSupportServices>
            <ImportantContactList importantUsers={organization.importantContacts}></ImportantContactList>
            <StyledSpacer></StyledSpacer>
            <Well style={{ padding: 0 }}>
                <Accordion level={1} isCompact defaultExpandedSections={[]} onTransitionEnd={() => zafUtil.resizeWindow()}>
                    <Accordion.Section>
                        <Accordion.Header>
                            <Accordion.Label>Organisation Services</Accordion.Label>
                        </Accordion.Header>
                        <Accordion.Panel style={{ paddingLeft: '4px', paddingRight: '4px' }}>
                            <OrganizationServices organizationServices={organization.services}></OrganizationServices>
                        </Accordion.Panel>
                    </Accordion.Section>
                </Accordion>
            </Well>
        </>
    )
}