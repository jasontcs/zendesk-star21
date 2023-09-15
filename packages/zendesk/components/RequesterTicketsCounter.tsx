
import { LG, SM } from '@zendeskgarden/react-typography';
import { TicketEntity, TicketStatusType } from '../common/entity';
import { Row, Col, Grid } from '@zendeskgarden/react-grid';
import React from 'react';
import { zafUtil } from '../common';

type RequesterTicketCounterProps = {
    tickets: TicketEntity[]
}

export const RequesterTicketCounter = ({ tickets }: RequesterTicketCounterProps) => {
    const map = tickets.reduce(
        (entryMap, e) => {
            if ((e.status == 'solved' || e.status == 'closed') && zafUtil.numDaysBetween(e.updateAt, new Date()) > 30) {
                return entryMap
            }
            return entryMap.set(e.status, entryMap.get(e.status) ? entryMap.get(e.status)! + 1 : 1)
        },
        new Map<TicketStatusType, number>()
    );
    return (
        <Grid gutters={false}>
            <Row justifyContent='center'>
                <CounterTile background='#ffb057' count={map.get('new') ?? 0} title='New' color='#703815'></CounterTile>
                <CounterTile background='#c72a1c' count={map.get('open') ?? 0} title='Open'></CounterTile>
                <CounterTile background='#3091ec' count={map.get('pending') ?? 0} title='Pending'></CounterTile>
                <CounterTile background='#2f3941' count={map.get('hold') ?? 0} title='On-hold'></CounterTile>
                <CounterTile background='#87929d' count={map.get('solved') ?? 0 + (map.get('closed') ?? 0)} title='Solved'></CounterTile>
            </Row>
        </Grid>
    )
}

const CounterTile = ({ count, background, title }: { count: number, background: string, color?: string, title: string }) => {

    return (<>
        {(count > 0) &&
            <Col size={2} style={{ width: 'initial', textAlign: 'center', margin: '0 6px' }}>
                <LG isBold style={{ color: background }}>{count > 99 ? '99+' : count}</LG>
                <SM>{title}</SM>
            </Col>
        }
    </>)
}