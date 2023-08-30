import './App.css'
import React from 'react'
import zafClient from '@app/zendesk/sdk'

import { Button } from '@zendeskgarden/react-buttons';
import { Body, Cell, Row as TableRow, Table } from '@zendeskgarden/react-tables';
import { LG , XL } from '@zendeskgarden/react-typography';
import { Tag } from '@zendeskgarden/react-tags';

import { zafConfig, zafDomain } from "@app/zendesk/common";
import { ServiceEntity, ServiceType, UserFlagTypeVip } from "@app/zendesk/common/entity";

function App() {
  const [requester, setRequester] = React.useState<string | undefined>()
  const [isVip, setIsVip] = React.useState(false)
  const [userFlags, setUserFlags] = React.useState<string[]>([])
  const [organizationServices, setOrganizationServices] = React.useState<ServiceEntity[]>([])
  const [guideUrl, setGuideUrl] = React.useState<string>('')

  async function requesterChanged(id: number) {
    const user = await zafDomain.getUser(id)
    const organization = await zafDomain.getOrganization(user.organizationId)

    setRequester(user.name)

    setIsVip(user.isVip)

    setUserFlags(user.userFlags
      .filter((flag) => !(flag.type instanceof UserFlagTypeVip))
      .map((flag) => flag.name)
    )

    setOrganizationServices(organization.services)

    setGuideUrl(organization.guideUrl)
  }

  React.useEffect(() => {
    zafClient.off('ticket.requester.id.changed', requesterChanged)
    zafClient.on('ticket.requester.id.changed', requesterChanged)
  })


  if (!requester) return (
    <>
      <LG isBold style={{ textAlign: "center" }}>Please select a requester!</LG>
    </>
  )

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
              .sort((a, b) => Object.values(ServiceType).indexOf(a.type) - Object.values(ServiceType).indexOf(b.type))
              .map((service) =>
                <TableRow isFocused={false}>
                  <Cell>
                    {service.name}
                  </Cell>
                  <Cell width="100px" style={{ textAlign: "center" }}>
                    <Tag hue={zafConfig.typeColor(service.type)} style={{ width: "100%" }}>
                      <span>{zafConfig.typeTitle(service.type)}</span>
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
  )
}

export default App
