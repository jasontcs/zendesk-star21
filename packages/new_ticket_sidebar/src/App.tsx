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

  var isLoading: number | undefined
  
  async function requesterChanged(id: number) {
    if (isLoading) return
    isLoading = id
    const start = performance.now();
    const _user = await zafDomain.getUser(id)
    setUser(_user)
    const _organization = await zafDomain.getOrganization(_user.organizationId)
    setOrganization(_organization)

    if (
      (user?.isVip === false || user?.isAuthorized === false) &&
      (_user.isVip || _user.isAuthorized)
    ) {
      setVisible(true)
    }

    const end = performance.now();
    if (await zafUtil.isSandbox()) {
      zafUtil.logFetchTime(start, end, 'New Ticket Sidebar')
    }
    isLoading = undefined
  }

  React.useEffect(() => {
    console.log('new_ticket_sidebar', 'useEffect')
    zafUtil.on([
      'ticket.requester.id.changed',
    ], requesterChanged)
    return () => {
      zafUtil.off([
        'ticket.requester.id.changed',
      ], requesterChanged)
    }
  }, [])

  React.useEffect(() => {
    zafUtil.resizeWindow()
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
