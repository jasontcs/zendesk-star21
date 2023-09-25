
import { LG } from '@zendeskgarden/react-typography';
import { Row, Col, Grid } from '@zendeskgarden/react-grid';
import React from 'react';

type RequesterTitleProps = {
    requester: string | undefined,
}

export const RequesterTitle = ({ requester }: RequesterTitleProps) => {
    return (
        <Grid gutters={false}>
            <Row style={{ textAlign: 'center' }}>
                <Col>
                    <LG isBold tag="span">{requester}</LG>
                </Col>
            </Row>
        </Grid>
    )
}
