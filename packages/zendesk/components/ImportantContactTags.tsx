import { Tag } from '@zendeskgarden/react-tags';
import { Grid, Row, Col } from '@zendeskgarden/react-grid';
import { IGardenTheme } from '@zendeskgarden/react-theming';
import styled from "styled-components";
import { UserFlagEntity } from '../common/entity';
import React from 'react';

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
          <Tag size="large" hue="yellow" style={{ width: "100%" }} className='blink_me'>
            <span>VIP</span>
          </Tag>
        </Col>
      </StyledRow>
    }
    {
      userFlags.map((flag) =>
        <StyledRow key={flag.key}>
          <Col>
            <Tag size="large" hue="green" style={{ width: "100%" }}>
              <span>{flag.name}</span>
            </Tag>
          </Col>
        </StyledRow>
      )
    }
  </Grid>