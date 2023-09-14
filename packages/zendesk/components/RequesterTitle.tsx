
import { XL } from '@zendeskgarden/react-typography';
import { Row, Col, Grid } from '@zendeskgarden/react-grid';
import React from 'react';

type RequesterTitleProps = {
    requester: string | undefined,
}

export const RequesterTitle = ({ requester }: RequesterTitleProps) => {
    return (
        <Grid gutters={false}>
            <p></p>
            <Row style={{ textAlign: 'center' }}>
                <Col>
                    <XL isBold tag="span">{requester}</XL>
                </Col>
            </Row>
        </Grid>
    )
}
