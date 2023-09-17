import React from 'react';
import { Row, Col, Grid } from '@zendeskgarden/react-grid';
import { Spinner } from '@zendeskgarden/react-loaders';

export const AppLoader = () => (
  <Grid gutters={false}>
    <Row alignItems="center">
      <Col textAlign="center">
        <Spinner />
      </Col>
    </Row>
  </Grid>
);

