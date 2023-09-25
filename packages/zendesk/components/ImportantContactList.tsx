
import { Body, Cell, Row, Table, GroupRow } from '@zendeskgarden/react-tables';
import { Tag } from '@zendeskgarden/react-tags';
import { UserEntity, UserFlagTypeVip } from '../common/entity';
import { Span, MD } from '@zendeskgarden/react-typography';
import zafClient from '../sdk';
import React from 'react';
import { Tooltip } from '@zendeskgarden/react-tooltips';
import { ImportantContactTags } from './ImportantContactTags';

type ImportantContactListProps = {
    importantUsers: UserEntity[],
}

export const ImportantContactList = ({ importantUsers }: ImportantContactListProps) => {
    const authorizedUsers = importantUsers.filter((user) => user.isAuthorized)
    const vips = importantUsers.filter((user) => user.isVip)

    const userOnClick = (user: UserEntity): void => {
        zafClient.invoke('routeTo', 'user', user.id)
    }

    return (
        <Table>
            <Body>
                {authorizedUsers.length > 0 &&
                    <GroupRow>
                        <Cell>
                            <MD><Span>AUTHORISED CONTACTS</Span></MD>
                        </Cell>
                        <Cell width={'75px'}></Cell>
                    </GroupRow>
                }
                {
                    authorizedUsers
                        .map((user) =>
                            <ImportantContactTooltip user={user} key={user.id}>
                                <Row key={user.id} onClick={() => userOnClick(user)} style={{ cursor: 'pointer' }} isFocused={true} isSelected>
                                    <Cell>
                                        <Span isBold>{user.name}</Span>
                                    </Cell>
                                    <Cell>
                                        <Tag hue="red" style={{ visibility: user.isAuthorized ? 'visible' : 'hidden', margin: '0 0 0 4px', width: "100%" }}>
                                            <Span>AUTH</Span>
                                        </Tag>
                                    </Cell>
                                </Row>
                            </ImportantContactTooltip>
                        )
                }
                {vips.length > 0 &&
                    <GroupRow>
                        <Cell colSpan={2}>
                            <MD><Span>VIP CONTACTS</Span></MD>
                        </Cell>
                    </GroupRow>
                }
                {
                    vips
                        .map((user) =>
                            <ImportantContactTooltip user={user} key={user.id}>
                                <Row onClick={() => userOnClick(user)} style={{ cursor: 'pointer' }} isFocused={true} isSelected isStriped>
                                    <Cell>
                                        <Span isBold>{user.name}</Span>
                                    </Cell>
                                    <Cell >
                                        <Tag hue="yellow" style={{ visibility: user.isVip ? 'visible' : 'hidden', margin: '0 0 0 4px', width: "100%" }}>
                                            <Span>VIP</Span>
                                        </Tag>
                                    </Cell>
                                </Row>
                            </ImportantContactTooltip>
                        )
                }
            </Body>
        </Table>
    )
}

const ImportantContactTooltip = ({ children, user }: { children: React.ReactElement<any, string | React.JSXElementConstructor<any>>, user: UserEntity }) =>
    <Tooltip
        type='light'
        content={
            <ImportantContactTags
                isVip={user.isVip}
                userFlags={user.userFlags.filter((flag) => !(flag.type instanceof UserFlagTypeVip))}
            ></ImportantContactTags>
        }
        placement='bottom'
        size='extra-large'
        style={{ padding: '10px', width: '300px' }}
    >
        {children}
    </Tooltip>