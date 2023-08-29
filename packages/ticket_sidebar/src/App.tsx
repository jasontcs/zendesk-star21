import React from "react";
import logo from "./logo.svg";
import "./App.css";
import zafClient from "@app/zendesk/sdk";
import { Button } from '@zendeskgarden/react-buttons';
import { Body, Cell, Head, HeaderCell, HeaderRow, Row as TableRow, Table } from '@zendeskgarden/react-tables';
import { Well, Title } from '@zendeskgarden/react-notifications';
import { Row, Col } from '@zendeskgarden/react-grid';

import { GetTicketResponse } from "./model";
import { zafDomain } from "@app/zendesk/common";
import { ServiceEntity, ServiceType, UserFlagTypeAuthorized, UserFlagTypeVip } from "@app/zendesk/common/entity";
import { SM, MD, LG, XL, XXL, XXXL } from '@zendeskgarden/react-typography';
import styled from "styled-components";
import { DEFAULT_THEME, focusStyles } from '@zendeskgarden/react-theming';
import { Tag } from '@zendeskgarden/react-tags';

function App() {
  const [requester, setRequester] = React.useState("")

  const [isVip, setIsVip] = React.useState(false)
  const [userFlags, setUserFlags] = React.useState<string[]>([])
  const [organizationServices, setOrganizationServices] = React.useState<ServiceEntity[]>([])
  const [guideUrl, setGuideUrl] = React.useState<string>('')

  const fetchAll = async () => {
    const { ticket }: GetTicketResponse = await zafClient.get("ticket");
    const user = await zafDomain.getUser(ticket.requester.id)
    const organization = await zafDomain.getOrganization(user.organizationId)

    setRequester(ticket.requester?.name || "Some Requester")

    setIsVip(user.isVip)

    setUserFlags(user.userFlags
      .filter((flag) => !(flag.type instanceof UserFlagTypeVip))
      .map((flag) => flag.name)
    )

    setOrganizationServices(organization.services)

    setGuideUrl(organization.guideUrl)
  };

  React.useEffect(() => {
    fetchAll();
  }, []);

  const typeColor = (type: ServiceType): string => {
    switch (type) {
      case ServiceType.managed: return 'red'
      case ServiceType.mobility: return 'black'
      case ServiceType.projects: return 'green'
      case ServiceType.cloud: return 'blue'
    }
  }


  return (
    <>
      <XL isBold style={{ textAlign: "center" }}>{requester}</XL>
      <hr />
      <Table size="small">
        <Body style={{ textAlign: "center" }}>
          {isVip &&
            <TableRow isFocused={false}>
              <Cell>
                <Tag size="large" hue="yellow" style={{ width: "100%" }}>
                  <span>VIP</span>
                </Tag>
              </Cell>
            </TableRow>
          }
          {
            userFlags.map((flag) =>
              <TableRow isFocused={false}>
                <Cell>
                  <Tag size="large" hue="green" style={{ width: "100%" }}>
                    <span>{flag}</span>
                  </Tag>
                </Cell>
              </TableRow>
            )
          }
        </Body>
      </Table>
      <Table size="small">
        <Body style={{ textAlign: "center" }}>
          {
            organizationServices
              .filter((service) => service.type)
              .sort((a, b) => Object.values(ServiceType).indexOf(a.type) - Object.values(ServiceType).indexOf(b.type))
              .map((service) =>
                <TableRow isFocused={false}>
                  <Cell>
                    {service.name}
                  </Cell>
                  <Cell width="100px">
                    <Tag hue={typeColor(service.type)} style={{ width: "100%" }}>
                      <span>{service.type}</span>
                    </Tag>
                  </Cell>
                </TableRow>
              )
          }
        </Body>
      </Table>
      <p></p>
      <a href={guideUrl} target="_blank">
        <Button isPrimary isStretched>Customer Guide</Button>
      </a>
    </>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       <a
    //         className="App-link"
    //         href="https://reactjs.org"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Learn React
    //       </a>
    //       {" | "}
    //       <a
    //         className="App-link"
    //         href="https://vitejs.dev/guide/features.html"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Vite Docs
    //       </a>
    //     </p>
    //   </header>
    // </div>
  );
}

export default App;
