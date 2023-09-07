
import { Body, Cell, Row, Table, GroupRow } from '@zendeskgarden/react-tables';
import { Tag } from '@zendeskgarden/react-tags';
import { UserEntity } from '../common/entity';
import { Span, MD } from '@zendeskgarden/react-typography';

type ImportantContactListProps = {
    importantUsers: UserEntity[],
}

export const ImportantContactList = ({ importantUsers }: ImportantContactListProps) => {
    const authorizedUsers = importantUsers.filter((user) => user.isAuthorized)
    const vips = importantUsers.filter((user) => user.isVip)

    return (
        <Table>
            <Body>
                {authorizedUsers.length > 0 &&
                    <GroupRow>
                        <Cell>
                            <MD><Span isBold>AUTHORISED CONTACTS</Span></MD>
                        </Cell>
                        <Cell width={'90px'}></Cell>
                    </GroupRow>
                }
                {
                    authorizedUsers
                        .map((user) =>
                            <Row isFocused={false} key={user.id}>
                                <Cell>
                                    {user.name}
                                </Cell>
                                <Cell>
                                    <Tag hue="red" style={{ visibility: user.isAuthorized ? 'visible' : 'hidden', margin: '0 0 0 4px', width: "100%" }}>
                                        <span>Auth</span>
                                    </Tag>
                                </Cell>
                            </Row>
                        )
                }
                {vips.length > 0 &&
                    <GroupRow>
                        <Cell colSpan={2}>
                            <MD><Span isBold>VIP CONTACTS</Span></MD>
                        </Cell>
                    </GroupRow>
                }
                {
                    vips
                        .map((user) =>
                            <Row isFocused={false} key={user.id}>
                                <Cell>
                                    {user.name}
                                </Cell>
                                <Cell >
                                    <Tag hue="yellow" style={{ visibility: user.isVip ? 'visible' : 'hidden', margin: '0 0 0 4px', width: "100%" }}>
                                        <span>VIP</span>
                                    </Tag>
                                </Cell>
                            </Row>
                        )
                }
            </Body>
        </Table>
    )
}