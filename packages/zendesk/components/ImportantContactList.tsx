
import { Body, Cell, Head, HeaderCell, HeaderRow, Row as TableRow, Table } from '@zendeskgarden/react-tables';
import { Tag } from '@zendeskgarden/react-tags';
import { UserEntity } from '../common/entity';

type ImportantContactListProps = {
    authorizedUsers: UserEntity[],
}

export const ImportantContactList = ({ authorizedUsers }: ImportantContactListProps) => {
    return (
        <Table>
            <Head>
                <HeaderRow>
                    <HeaderCell>AUTHORISED CONTACTS</HeaderCell>
                    <HeaderCell width="90px"></HeaderCell>
                </HeaderRow>
            </Head>
            <Body>
                {
                    authorizedUsers.map((user) =>
                        <TableRow isFocused={true} key={user.id}>
                            <Cell>
                                {user.name}
                            </Cell>
                            <Cell>
                                <Tag size='small' hue="yellow" style={{ visibility: user.isVip ? 'visible' : 'hidden', margin: '0 0 0 4px' }}>
                                    <span>VIP</span>
                                </Tag>
                                <Tag size='small' hue="red" style={{ visibility: user.isAuthorized ? 'visible' : 'hidden', margin: '0 0 0 4px' }}>
                                    <span>Auth</span>
                                </Tag>
                            </Cell>
                        </TableRow>
                    )
                }
            </Body>
        </Table>
    )
}