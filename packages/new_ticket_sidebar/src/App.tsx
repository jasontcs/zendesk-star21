import './App.css'
import React from 'react'
import zafClient from '@app/zendesk/sdk'

import { zafDomain } from "@app/zendesk/common";
import { ServiceEntity, UserFlagTypeVip } from "@app/zendesk/common/entity";
import { AppThemeProvider, CustomerGuideButton, ImportantContactTags, NoSelectRequesterLabel, OrganizationServices, RequesterTitle } from '@app/zendesk/components';

function App() {
  const [requester, setRequester] = React.useState<string | undefined>()
  const [isVip, setIsVip] = React.useState(false)
  const [userFlags, setUserFlags] = React.useState<string[]>([])
  const [organizationServices, setOrganizationServices] = React.useState<ServiceEntity[]>([])
  const [guideUrl, setGuideUrl] = React.useState<string | undefined>()

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
    if (!zafClient.has('ticket.requester.id.changed', requesterChanged)) {
      zafClient.on('ticket.requester.id.changed', requesterChanged)
    }
  })


  if (!requester) return (
    <NoSelectRequesterLabel></NoSelectRequesterLabel>
  )
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
