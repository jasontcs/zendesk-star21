import { Tag } from '@zendeskgarden/react-tags';
import { Grid, Row, Col } from '@zendeskgarden/react-grid';
import { IGardenTheme } from '@zendeskgarden/react-theming';
import styled from "styled-components";
import { UserFlagEntity, UserFlagTypeAuthorized } from '../common/entity';
import React from 'react';
import { Span } from '@zendeskgarden/react-typography';

type ImportantContactTagsProps = {
  isVip: boolean,
  userFlags: UserFlagEntity[]
}

const StyledRow = styled(Row)`
& + & {
  margin-top: ${p => (p.theme as IGardenTheme).space.xxs};
}
`;

export const ImportantContactTags = ({ isVip, userFlags }: ImportantContactTagsProps) =>
  <Grid gutters={false}>
    {
      isVip &&
      <StyledRow>
        <Col>
          <Tag className='blink_border' size="large" hue="yellow" style={{ width: "100%", border: "3px solid #ad8004" }}>
            <Span>VIP</Span>
          </Tag>
        </Col>
      </StyledRow>
    }
    {
      userFlags
        .sort((_, b) => b.type instanceof UserFlagTypeAuthorized ? 1 : -1)
        .map((flag) =>
          <StyledRow key={flag.key}>
            <Col>
              <Tag size="large" hue="green" style={{ width: "100%" }}>
                <Span>{flag.name}</Span>
              </Tag>
            </Col>
          </StyledRow>
        )
    }
  </Grid>