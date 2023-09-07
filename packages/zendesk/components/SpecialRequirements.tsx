
import { Accordion } from '@zendeskgarden/react-accordions';
import { Row, Col } from '@zendeskgarden/react-grid';
import { IGardenTheme } from '@zendeskgarden/react-theming';
import styled from "styled-components";

type SpecialRequirementsProps = {
    content: string,
}

const StyledRow = styled(Row)`
& + & {
  margin-bottom: ${p => (p.theme as IGardenTheme).space.xs};
}
`;

export const SpecialRequirements = ({ content }: SpecialRequirementsProps) => {
    return (
        <StyledRow>
            <Col>
                <Accordion level={1} isBare isCompact isCollapsible defaultExpandedSections={[]}>
                    <Accordion.Section>
                        <Accordion.Header>
                            <Accordion.Label>Special Requirement</Accordion.Label>
                        </Accordion.Header>
                        <Accordion.Panel>
                            {content}
                        </Accordion.Panel>
                    </Accordion.Section>
                </Accordion>
            </Col>
        </StyledRow>
    )
}
