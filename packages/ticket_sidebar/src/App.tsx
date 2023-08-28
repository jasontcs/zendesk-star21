import React from "react";
import logo from "./logo.svg";
import "./App.css";
import zafClient from "@app/zendesk/sdk";
import { Button } from '@zendeskgarden/react-buttons';
import { Body, Cell, Head, HeaderCell, HeaderRow, Row as TableRow, Table } from '@zendeskgarden/react-tables';
import { Well, Title } from '@zendeskgarden/react-notifications';
import { Row, Col } from '@zendeskgarden/react-grid';

import { GetTicketResponse } from "./model";
import { zafData } from "@app/zendesk/common";

function App() {
  const [requester, setRequester] = React.useState("")

  const [userFlags, setUserFlags] = React.useState<string[]>([])
  const [organizationFlags, setOrganizationFlags] = React.useState<string[]>([])
  const [guideUrl, setGuideUrl] = React.useState<string>('')

  const fetchAll = async () => {
    const { ticket }: GetTicketResponse = await zafClient.get("ticket");
    const userFields = await zafData.getUserFields()
    const user = await zafData.getUser(ticket.requester.id)
    const organizationFields = await zafData.getOrganizationFields()
    const organization = await zafData.getOrganization(user.organization_id)

    setRequester(ticket.requester?.name || "Some Requester")

    setUserFlags(user.tags.flatMap((tag) => {
      const title = userFields.find((field) =>
        field.tag == tag
      )?.title
      if (title) {
        return [title];
      }
      return title ? [title] : [];
    }))

    setOrganizationFlags(organization.tags.flatMap((tag) => {
      const title = organizationFields.find((field) =>
        field.key == tag
      )?.title
      if (title) {
        return [title];
      }
      return title ? [title] : [];
    }))

    setGuideUrl(organization.organization_fields.guide_url ?? '')
  };

  React.useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>{requester}</p>
        <Well>
          <Table>
            <Body>
              {
                userFlags.map((flag) =>
                  <TableRow>
                    <Cell>
                      {flag}
                    </Cell>
                  </TableRow>
                )
              }
            </Body>
          </Table>
        </Well>
        <p></p>
        <Well>
          <Table>
            <Body>
              {
                organizationFlags.map((flag) =>
                  <TableRow>
                    <Cell>
                      {flag}
                    </Cell>
                  </TableRow>
                )
              }
            </Body>
          </Table>
        </Well>
        <p></p>
        <a href={guideUrl} target="_blank">
          <Button isPrimary isStretched>Customer Guide</Button>
        </a>
        {/* <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {" | "}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p> */}
      </header>
    </div>
  );
}

export default App;
