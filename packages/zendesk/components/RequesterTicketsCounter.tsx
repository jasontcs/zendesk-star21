
import { LG } from '@zendeskgarden/react-typography';
import { TicketEntity, TicketStatusType } from '../common/entity';
import { Row, Col, Grid } from '@zendeskgarden/react-grid';
import React from 'react';
import { zafUtil } from '../common';
import { Anchor } from '@zendeskgarden/react-buttons';
import { Tooltip } from '@zendeskgarden/react-tooltips';
import { Tag } from '@zendeskgarden/react-tags';

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
                <CounterTile titleOnClick={titleOnClick} background='#87929d' count={solved} title='Solved' tooltip={'Solved (30 days)'}></CounterTile>
            </Row>
        </Grid>
    )
}

const CounterTile = ({ count, background, title, tooltip, titleOnClick, color }: { count: number, background: string, color?: string, title: string, tooltip?: string, titleOnClick?: () => void }) => {

    return (<>
        {(count > 0) &&
            <Col size={2} style={{ width: 'initial', textAlign: 'center'}}>
                <Tooltip content={(tooltip ?? title) + ' = ' + count} placement='bottom' isVisible={false}>
                    <Anchor onClick={titleOnClick}>
                        <LG style={{ color: background }}>{count > 99 ? '99+' : count}</LG>
                        <Tag size='small' style={{ backgroundColor: background, color: color ?? 'white', cursor: 'pointer', margin: '-10px 0 0 0' }}>{title}</Tag>
                    </Anchor>
                </Tooltip>
            </Col>
        }
    </>)
}