import { Tag } from '@zendeskgarden/react-tags';
import { Row, Col } from '@zendeskgarden/react-grid';
import { IGardenTheme } from '@zendeskgarden/react-theming';
import styled from "styled-components";

type ImportantContactTagsProps = {
  isVip: boolean,
  userFlags: string[]
}

const StyledRow = styled(Row)`
& + & {
  margin-top: ${p => (p.theme as IGardenTheme).space.xs};
}
`;

export const ImportantContactTags = ({ isVip, userFlags }: ImportantContactTagsProps) => <>
  {
          isVip &&
          <StyledRow>
            <Col>
              <Tag size="large" hue="yellow" style={{ width: "100%" }}>
                <span>VIP</span>
              </Tag>
            </Col>
          </StyledRow>
        }
        {
          userFlags.map((flag) =>
            <StyledRow key={flag}>
              <Col>
                <Tag size="large" hue="green" style={{ width: "100%" }}>
                  <span>{flag}</span>
                </Tag>
              </Col>
            </StyledRow>
          )
        }
</>