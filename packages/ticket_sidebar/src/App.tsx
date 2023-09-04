import React from "react";
import './App.css'
import zafClient from "@app/zendesk/sdk";

import { Button } from '@zendeskgarden/react-buttons';
import { Body, Cell, Row as TableRow, Table } from '@zendeskgarden/react-tables';
import { XL, } from '@zendeskgarden/react-typography';
import { Tag } from '@zendeskgarden/react-tags';

import { zafDomain } from "@app/zendesk/common";
import { ServiceEntity, ServiceType, UserFlagTypeVip } from "@app/zendesk/common/entity";

import { GetTicketResponse } from '@app/zendesk/common/api_model';

function App() {
  const [requester, setRequester] = React.useState<string | undefined>()
  const [isVip, setIsVip] = React.useState(false)
  const [userFlags, setUserFlags] = React.useState<string[]>([])
  const [organizationServices, setOrganizationServices] = React.useState<ServiceEntity[]>([])
  const [guideUrl, setGuideUrl] = React.useState<string | undefined>()

  const fetchAll = async () => {
    const { ticket }: GetTicketResponse = await zafClient.get("ticket");
    const user = await zafDomain.getUser(ticket.requester.id)
    const organization = await zafDomain.getOrganization(user.organizationId)

    setRequester(ticket.requester.name)

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
    if (!zafClient.has('app.registered', fetchAll)) {
      zafClient.on('app.registered', fetchAll)
    }
  }, []);

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
        <Body>
          {
            organizationServices
              .filter((service) => service.type)
              .sort((a, b) => Object.values(ServiceType).indexOf(a.type!) - Object.values(ServiceType).indexOf(b.type!))
              .map((service) =>
                <TableRow isFocused={false}>
                  <Cell width="100px" style={{ textAlign: "center" }}>
                    <Tag hue={service.color} style={{ width: "100%" }}>
                      <span>{service.typeTitle}</span>
                    </Tag>
                  </Cell>
                  <Cell style={{ textAlign: "right" }}>
                    {service.name}
                  </Cell>
                </TableRow>
              )
          }
        </Body>
      </Table>
      <p></p>
      <a href={guideUrl} target="_blank">
        <Button isPrimary isStretched disabled={guideUrl == null}>Customer Guide</Button>
      </a>
    </>
  )
}

export default App
