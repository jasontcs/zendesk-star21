import React from "react";
import './App.css'
import zafClient from "@app/zendesk/sdk";

import { zafDomain } from "@app/zendesk/common";
import { ServiceEntity, UserFlagTypeVip } from "@app/zendesk/common/entity";

import { GetTicketResponse } from '@app/zendesk/common/api_model';
import { AppThemeProvider, CustomerGuideButton, ImportantContactTags, OrganizationServices, RequesterTitle } from '@app/zendesk/components';

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
    <AppThemeProvider>
      <RequesterTitle requester={requester}></RequesterTitle>
      <ImportantContactTags isVip={isVip} userFlags={userFlags}></ImportantContactTags>
      <OrganizationServices organizationServices={organizationServices}></OrganizationServices>
      <CustomerGuideButton guideUrl={guideUrl}></CustomerGuideButton>
    </AppThemeProvider>
  )
}

export default App
