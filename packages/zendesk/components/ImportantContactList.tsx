
import { Body, Cell, Row, Table, GroupRow } from '@zendeskgarden/react-tables';
import { Tag } from '@zendeskgarden/react-tags';
import { UserEntity } from '../common/entity';
import { Span, MD } from '@zendeskgarden/react-typography';
import zafClient from '../sdk';
import React from 'react';

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
                        <Cell width={'90px'}></Cell>
                    </GroupRow>
                }
                {
                    authorizedUsers
                        .map((user) =>
                            <Row key={user.id} onClick={() => userOnClick(user)} style={{ cursor: 'pointer' }} isFocused={true} isSelected>
                                <Cell>
                                    <Span isBold>{user.name}</Span>
                                </Cell>
                                <Cell>
                                    <Tag hue="red" style={{ visibility: user.isAuthorized ? 'visible' : 'hidden', margin: '0 0 0 4px', width: "100%" }}>
                                        <Span>Auth</Span>
                                    </Tag>
                                </Cell>
                            </Row>
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
                            <Row key={user.id} onClick={() => userOnClick(user)} style={{ cursor: 'pointer' }} isFocused={true} isSelected isStriped>
                                <Cell>
                                    <Span isBold>{user.name}</Span>
                                </Cell>
                                <Cell >
                                    <Tag hue="yellow" style={{ visibility: user.isVip ? 'visible' : 'hidden', margin: '0 0 0 4px', width: "100%" }}>
                                        <Span>VIP</Span>
                                    </Tag>
                                </Cell>
                            </Row>
                        )
                }
            </Body>
        </Table>
    )
}