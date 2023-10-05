
import { LG } from '@zendeskgarden/react-typography';
import { Row, Col, Grid } from '@zendeskgarden/react-grid';
import React from 'react';
import { Skeleton } from '@zendeskgarden/react-loaders';

type RequesterTitleProps = {
    requester: string | undefined,
}

export const RequesterTitle = ({ requester }: RequesterTitleProps) => {
    return (
        <Grid gutters={false}>
            <Row style={{ textAlign: 'center' }}>
                <Col>
                    {
                        requester
                            ? <LG isBold tag="span">{requester}</LG>
                            : <Skeleton />
                    }
                </Col>
            </Row>
        </Grid>
    )
}
