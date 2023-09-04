import { useState } from 'react'
import './App.css'
import React from 'react'
import { zafDomain, zafUtil } from "@app/zendesk/common";
import zafClient from '@app/zendesk/sdk'
import { GetOrganizationResponse } from '@app/zendesk/common/api_model'
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
    if (!zafClient.has('app.registered', fetchAll)) {
      zafClient.on('app.registered', fetchAll)
    }
  }, []);

  return (
    <>
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
              <TableRow isFocused={true}>
                <Cell>
                  {user.name}
                </Cell>
                <Cell>
                    <Tag size='small' hue="yellow" style={{visibility: user.isVip ? 'visible' : 'hidden', margin: '0 0 0 4px'}}>
                      <span>VIP</span>
                    </Tag>
                    <Tag size='small' hue="red" style={{visibility: user.isAuthorized ? 'visible' : 'hidden', margin: '0 0 0 4px'}}>
                      <span>Auth</span>
                    </Tag>
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