
import { Accordion } from '@zendeskgarden/react-accordions';
import { Row, Col } from '@zendeskgarden/react-grid';
import { Well } from '@zendeskgarden/react-notifications';
import { IGardenTheme } from '@zendeskgarden/react-theming';
import styled from "styled-components";

type SpecialRequirementsProps = {
    content: string,
}

const StyledRow = styled(Row)`
& + & {
  margin-top: ${p => (p.theme as IGardenTheme).space.xs};
}
`;

export const SpecialRequirements = ({ content }: SpecialRequirementsProps) => {
    return (
        <>
            <StyledRow></StyledRow>
            <StyledRow>
                <Col>
                    <Well isRecessed style={{ padding: 0 }}>
                        <Accordion level={1} isBare isCompact isCollapsible defaultExpandedSections={[]}>
                            <Accordion.Section>
                                <Accordion.Header>
                                    <Accordion.Label>
                                        Special Requirement
                                    </Accordion.Label>
                                </Accordion.Header>
                                <Accordion.Panel>
                                    {content}
                                </Accordion.Panel>
                            </Accordion.Section>
                        </Accordion>
                    </Well>
                </Col>
            </StyledRow>
        </>
    )
}
