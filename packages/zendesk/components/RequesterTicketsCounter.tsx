
import { LG, Span } from '@zendeskgarden/react-typography';
import { TicketEntity } from '../common/entity';
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
    const map = zafUtil.groupBy(tickets, (e) => e.status)

    const props: CounterTileProps[] = [
        {
            tickets: map.get('new') ?? [],
            background: '#ffb057',
            color: '#703815',
            title: 'New',
        },
        {
            tickets: map.get('open') ?? [],
            background: '#c72a1c',
            title: 'Open',
        },
        {
            tickets: map.get('pending') ?? [],
            background: '#3091ec',
            title: 'Pending',
        },
        {
            tickets: map.get('hold') ?? [],
            background: '#2f3941',
            title: 'On-hold',
        },
        {
            tickets: [
                ...map.get('solved')?.filter((t) => zafUtil.numDaysBetween(t.updateAt, new Date()) > 30) ?? [],
                ...map.get('closed')?.filter((t) => zafUtil.numDaysBetween(t.updateAt, new Date()) > 30) ?? [],
            ],
            background: '#87929d',
            title: 'Solved',
        },
    ]

    const CounterTile = ({ tickets, background, title, color }: CounterTileProps) => {
        const count = tickets.length
        return (<>
            {(count > 0) &&
                <Col size={2} style={{ width: 'initial', textAlign: 'center' }}>
                    {
                        tickets.length == 1
                            ? <Tooltip
                                content={<CounterTootipContent ticket={tickets[0]}></CounterTootipContent>}
                                placement='bottom'
                                zIndex={1}
                                size='medium'
                            >
                                <Anchor onClick={titleOnClick} style={{ textDecoration: 'none' }}>
                                    <LG style={{ color: background }}>{count > 99 ? '99+' : count}</LG>
                                    <Tag size='small' style={{ backgroundColor: background, color: color ?? 'white', cursor: 'pointer', margin: '-10px 0 0 0' }}>{title}</Tag>
                                </Anchor>
                            </Tooltip>
                            : <Anchor onClick={titleOnClick} style={{ textDecoration: 'none' }}>
                                <LG style={{ color: background }}>{count > 99 ? '99+' : count}</LG>
                                <Tag size='small' style={{ backgroundColor: background, color: color ?? 'white', cursor: 'pointer', margin: '-10px 0 0 0' }}>{title}</Tag>
                            </Anchor>
                    }
                </Col>
            }
        </>)
    }

    return (
        <Grid gutters={false}>
            <Row justifyContent='center'>
                {props.map((props, index) => {
                    return <CounterTile
                        key={index}
                        tickets={props.tickets}
                        background={props.background}
                        title={props.title}
                        color={props.color}
                    ></CounterTile>
                }
                )}
            </Row>
        </Grid>
    )
}

type CounterTileProps = {
    tickets: TicketEntity[],
    background: string,
    color?: string,
    title: string,
}

const CounterTootipContent = ({ ticket }: { ticket: TicketEntity }) =>
    <>
        <Span tag='div'>#{ticket.id}</Span>
        <Span tag='div'>{ticket.subject}</Span>
    </>