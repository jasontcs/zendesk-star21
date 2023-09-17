
import { LG, SM } from '@zendeskgarden/react-typography';
import { TicketEntity, TicketStatusType } from '../common/entity';
import { Row, Col, Grid } from '@zendeskgarden/react-grid';
import React from 'react';
import { zafUtil } from '../common';
import { Anchor } from '@zendeskgarden/react-buttons';
import { Tooltip } from '@zendeskgarden/react-tooltips';

type RequesterTicketCounterProps = {
    tickets: TicketEntity[],
    titleOnClick?: () => void,
}

export const RequesterTicketCounter = ({ tickets, titleOnClick }: RequesterTicketCounterProps) => {
    const map = tickets.reduce(
        (entryMap, e) => {
            if ((e.status == 'solved' || e.status == 'closed') && zafUtil.numDaysBetween(e.updateAt, new Date()) > 30) {
                return entryMap
            }
            return entryMap.set(e.status, entryMap.get(e.status) ? entryMap.get(e.status)! + 1 : 1)
        },
        new Map<TicketStatusType, number>()
    );

    const solved = map.get('solved') ?? 0 + (map.get('closed') ?? 0)

    return (
        <Grid gutters={false}>
            <Row justifyContent='center'>
                <CounterTile titleOnClick={titleOnClick} background='#ffb057' count={map.get('new') ?? 0} title='New' color='#703815'></CounterTile>
                <CounterTile titleOnClick={titleOnClick} background='#c72a1c' count={map.get('open') ?? 0} title='Open'></CounterTile>
                <CounterTile titleOnClick={titleOnClick} background='#3091ec' count={map.get('pending') ?? 0} title='Pending'></CounterTile>
                <CounterTile titleOnClick={titleOnClick} background='#2f3941' count={map.get('hold') ?? 0} title='On-hold'></CounterTile>
                <CounterTile titleOnClick={titleOnClick} background='#87929d' count={solved} title='Solved*' fullTitle={'Solved (30 days)'}></CounterTile>
            </Row>
        </Grid>
    )
}

const CounterTile = ({ count, background, title, fullTitle, titleOnClick }: { count: number, background: string, color?: string, title: string, fullTitle?: string, titleOnClick?: () => void }) => {

    return (<>
        {(count > 0) &&
            <Col size={2} style={{ width: 'initial', textAlign: 'center', margin: '0 6px' }}>
            <Tooltip content={(fullTitle ?? title) + ' = ' + count} placement='bottom'>
                <Anchor onClick={titleOnClick}>
                    <LG isBold style={{ color: background }}>{count > 99 ? '99+' : count}</LG>
                        <SM>{title}</SM>
                </Anchor>
                    </Tooltip>
            </Col>
        }
    </>)
}