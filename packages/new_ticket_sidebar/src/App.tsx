import './App.css'
import React from 'react'
import zafClient from '@app/zendesk/sdk'

import { zafDomain } from "@app/zendesk/common";
import { OrganizationEntity, UserEntity } from "@app/zendesk/common/entity";
import { AppThemeProvider, NoSelectRequesterLabel, OrganizationPanel } from '@app/zendesk/components';
import { useImportantContactAlertContext } from '@app/zendesk/components/ImportantContactAlert';

function App() {
  const { setVisible } = useImportantContactAlertContext()
  const [user, setUser] = React.useState<UserEntity | undefined>()
  const [organization, setOrganization] = React.useState<OrganizationEntity | undefined>()

  async function requesterChanged(id: number) {
    const _user = await zafDomain.getUser(id)
    const _organization = await zafDomain.getOrganization(_user.organizationId)

    if (
      (user?.isVip === false || user?.isAuthorized === false) &&
      (_user.isVip || _user.isAuthorized)
    ) {
      setVisible(true)
    }

    setUser(_user)
    setOrganization(_organization)
  }

  React.useEffect(() => {
    if (!zafClient.has('ticket.requester.id.changed', requesterChanged)) {
      zafClient.on('ticket.requester.id.changed', requesterChanged)
    }
  })


  if (!user || !organization) return (
    <NoSelectRequesterLabel></NoSelectRequesterLabel>
  )
  return (
    <AppThemeProvider>
      <OrganizationPanel 
        user={user}
        organization={organization}
      ></OrganizationPanel>
    </AppThemeProvider>
  )
}

export default App
