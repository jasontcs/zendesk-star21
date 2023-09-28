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
    const start = performance.now();
    const _user = await zafDomain.getUser(id)
    setUser(_user)
    zafUtil.resizeWindow()
    const _organization = await zafDomain.getOrganization(_user.organizationId)
    setOrganization(_organization)
    zafUtil.resizeWindow()

    if (
      (user?.isVip === false || user?.isAuthorized === false) &&
      (_user.isVip || _user.isAuthorized)
    ) {
      setVisible(true)
    }

    zafUtil.resizeWindow()
    const end = performance.now();
    if (await zafUtil.isSandbox()) {
      zafUtil.logFetchTime(start, end)
    }
  }

  React.useEffect(() => {
    zafUtil.on([
      'ticket.requester.id.changed',
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
