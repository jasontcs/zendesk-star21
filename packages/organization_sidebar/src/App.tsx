import { useState } from 'react'
import './App.css'
import React from 'react'
import { zafDomain, zafUtil } from "@app/zendesk/common";
import zafClient from '@app/zendesk/sdk'
import { GetOrganizationResponse } from './model'
import { Body, Cell, Head, HeaderCell, HeaderRow, Row as TableRow, Table } from '@zendeskgarden/react-tables';
import { Tag } from '@zendeskgarden/react-tags';
import { UserEntity } from '@app/zendesk/common/entity';

function App() {
  const [authorizedUsers, setAuthorizedUsers] = useState<UserEntity[]>([])

  const fetchAll = async () => {
    const { organization }: GetOrganizationResponse = await zafClient.get("organization");
    const { importantContacts } = await zafDomain.getOrganization(organization.id)
    setAuthorizedUsers(importantContacts)
    zafUtil.resizeWindow()
  }

  React.useEffect(() => {
    fetchAll()
    zafClient.on('app.registered', fetchAll)
  }, []);

  return (
    <>
      <Table>
        <Head>
          <HeaderRow>
            <HeaderCell>AUTHORISED CONTACTS</HeaderCell>
            <HeaderCell width="60px"></HeaderCell>
          </HeaderRow>
        </Head>
        <Body>
          {
            authorizedUsers.map((user) =>
              <TableRow isFocused={false}>
                <Cell>
                  {user.name}
                </Cell>
                <Cell>
                  {user.isVip &&
                    <Tag hue="yellow">
                      <span>VIP</span>
                    </Tag>}
                </Cell>
              </TableRow>
            )
          }
        </Body>
      </Table>
    </>
  )
}

export default App