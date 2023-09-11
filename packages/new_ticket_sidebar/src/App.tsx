import './App.css'
import React from 'react'

import { zafDomain, zafUtil } from "@app/zendesk/common";
import { OrganizationEntity, UserEntity } from "@app/zendesk/common/entity";
import { NoSelectRequesterLabel, TicketPanel } from '@app/zendesk/components';
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
    zafUtil.resizeWindow()
  }

  React.useEffect(() => {
    zafUtil.on([
      'ticket.requester.id.changed', 
      '*.changed',
    ], requesterChanged)
  })


  if (!user || !organization) return (
    <NoSelectRequesterLabel></NoSelectRequesterLabel>
  )
  return (
    <TicketPanel
      user={user}
      organization={organization}
    ></TicketPanel>
  )
}

export default App
