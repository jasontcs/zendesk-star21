
import { Accordion } from '@zendeskgarden/react-accordions';
import { Row, Col, Grid } from '@zendeskgarden/react-grid';
import { Well } from '@zendeskgarden/react-notifications';
import { IGardenTheme } from '@zendeskgarden/react-theming';
import styled from "styled-components";
import { Span } from '@zendeskgarden/react-typography';

type SpecialRequirementsProps = {
    content: string,
}

const StyledRow = styled(Row)`
& + & {
  margin-top: ${p => (p.theme as IGardenTheme).space.xs};
}
`;

const StyledSpan = styled(Span)`
& + & {
    margin-left: ${p => (p.theme as IGardenTheme).space.sm};
    margin-right: ${p => (p.theme as IGardenTheme).space.sm};
}`

export const SpecialRequirements = ({ content }: SpecialRequirementsProps) => {
    return (
        <Grid gutters={false}>
            <StyledRow></StyledRow>
            <StyledRow>
                <Col>
                    <Well isRecessed style={{ padding: 0 }}>
                        <Accordion level={1} isBare isCompact isCollapsible>
                            <Accordion.Section>
                                <Accordion.Header>
                                    <Accordion.Label>
                                        <StyledSpan>Special Requirement</StyledSpan>
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
        </Grid>
    )
}
