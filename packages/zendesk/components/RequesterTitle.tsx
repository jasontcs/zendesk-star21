
import { SM, Span, XL } from '@zendeskgarden/react-typography';
import { Tag } from '@zendeskgarden/react-tags';
import { TicketEntity, TicketStatusType } from '../common/entity';
import { Row, Col, Grid } from '@zendeskgarden/react-grid';

type RequesterTitleProps = {
    requester: string | undefined,
    tickets: TicketEntity[]
}

export const RequesterTitle = ({ requester, tickets }: RequesterTitleProps) => {
    const map = tickets.reduce(
        (entryMap, e) => entryMap.set(e.status, entryMap.get(e.status) ? entryMap.get(e.status)! + 1 : 1),
        new Map<TicketStatusType, number>()
    );
    return (
        <Grid gutters={false}>
            <p></p>
            <Row style={{ textAlign: 'center' }}>
                <Col>
                    <XL isBold tag="span">{requester}</XL>
                </Col>
            </Row>
            <Row justifyContent='center'>
                <Col md="auto" style={{ width: 'initial' }}>
                    <CounterTag background='#ffb057' count={map.get('new')!} title='New' color='#703815'></CounterTag>
                    <CounterTag background='#c72a1c' count={map.get('open')!} title='Open'></CounterTag>
                    <CounterTag background='#3091ec' count={map.get('pending')!} title='Pending'></CounterTag>
                    <CounterTag background='#2f3941' count={map.get('hold')!} title='On-hold'></CounterTag>
                    <CounterTag background='#87929d' count={map.get('solved')! + map.get('closed')!} title='Solved'></CounterTag>
                </Col>
            </Row>
            <hr />
        </Grid>
    )
}

const CounterTag = ({ count, background, color, title }: { count: number, background: string, color?: string, title: string }) => {

    return (<>
        {(count > 0) &&
            <Span style={{ margin: '0 4px' }}>
                <Tag size='medium' style={{ backgroundColor: background, color: color ?? '#ffffff' }}>{title}</Tag>
                <SM tag='span'>{' x'}{count}</SM>
            </Span>
        }
    </>)
}