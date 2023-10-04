import React from 'react';
import { Row, Col, Grid } from '@zendeskgarden/react-grid';
import { Spinner } from '@zendeskgarden/react-loaders';
import { SM } from '@zendeskgarden/react-typography';
import { zafUtil } from '../common';
import styled from 'styled-components';
import { IGardenTheme } from '@zendeskgarden/react-theming';

export const AppLoader = () => {
  const [showMessage, setShowMessage] = React.useState(false)

  React.useEffect(() => {
    (async function () {
      await new Promise(f => setTimeout(f, 5000));
      setShowMessage(true)
    })()
  }, [])

  React.useEffect(() => { zafUtil.resizeWindow() })

  const StyledSpacer = styled.div`
  height: ${p => (p.theme as IGardenTheme).space.xxs};
`;

  return <Grid gutters={false}>
    <Row alignItems="center">
      <Col textAlign="center">
        <Spinner />
      </Col>
    </Row>
    {
      showMessage &&
      <Row alignItems="center">
        <Col textAlign="center">
          <StyledSpacer></StyledSpacer>
          <SM>Please refresh the web page if needed</SM>
        </Col>
      </Row>
    }
  </Grid>
}