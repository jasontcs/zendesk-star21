import { useState } from 'react'
import './App.css'
import React from 'react'
import { zafData, zafUtil } from "@app/zendesk/common";
import zafClient from '@app/zendesk/sdk'
import { GetOrganizationResponse } from './model'
import { Body, Cell, Row as TableRow, Table } from '@zendeskgarden/react-tables';
import { Tag } from '@zendeskgarden/react-tags';
import { User } from '@app/zendesk/common/model';

function App() {
  const [authorizedUsers, setAuthorizedUsers] = useState<User[]>([])

  const fetchAll = async () => {
    const { organization }: GetOrganizationResponse = await zafClient.get("organization");
    const users = await zafData.getOrganizationUsers(organization.id)
    setAuthorizedUsers(users.filter((user) => zafData.isAuthorized(user)))
  }

  React.useEffect(() => {
    zafUtil.resizeWindow()
    fetchAll()
  }, []);

  return (
    <>
      <Table>
        <Body>
          {
            authorizedUsers.map((user) =>
              <TableRow>
                <Cell>
                  {user.name}
                  {zafData.isVip(user) &&
                    <Tag hue="yellow">
                      <span>VIP</span>
                    </Tag>
                  }
                </Cell>
              </TableRow>
            )
          }
        </Body>
      </Table>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App