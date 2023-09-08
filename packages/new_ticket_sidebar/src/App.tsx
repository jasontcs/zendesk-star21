import './App.css'
import React from 'react'
import zafClient from '@app/zendesk/sdk'

import { zafDomain } from "@app/zendesk/common";
import { ServiceType, UserFlagTypeVip } from "@app/zendesk/common/entity";
import { AppThemeProvider, NoSelectRequesterLabel, OrganizationPanel } from '@app/zendesk/components';

function App() {
  const [requester, setRequester] = React.useState<string | undefined>()
  const [isVip, setIsVip] = React.useState(false)
  const [userFlags, setUserFlags] = React.useState<string[]>([])
  const [organizationServices, setOrganizationServices] = React.useState<ServiceType[]>([])
  const [guideUrl, setGuideUrl] = React.useState<string | undefined>()
  const [specialRequirements, setSpecialRequirements] = React.useState<string | undefined>()

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

    setSpecialRequirements(user.specialRequirements)
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
      <OrganizationPanel 
        requester={requester}
        guideUrl={guideUrl}
        isVip={isVip}
        userFlags={userFlags}
        organizationServices={organizationServices}
        specialRequirements={specialRequirements}
      ></OrganizationPanel>
    </AppThemeProvider>
  )
}

export default App
