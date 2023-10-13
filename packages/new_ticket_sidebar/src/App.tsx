import './App.css'
import React from 'react'

import { zafDomain, zafUtil } from "@app/zendesk/common";
import { OrganizationEntity, UserEntity } from "@app/zendesk/common/entity";
import { AppLoader, NoSelectRequesterLabel, TicketPanel } from '@app/zendesk/components';
import { useImportantContactAlertContext } from '@app/zendesk/components/ImportantContactAlert';

function App() {
  const { setVisible } = useImportantContactAlertContext()
  const [user, setUser] = React.useState<UserEntity | undefined>()
  const [organization, setOrganization] = React.useState<OrganizationEntity | undefined>()
  const [userName, setUserName] = React.useState<string | undefined>()

  var isLoading: number | undefined

  async function requesterChanged(id: number) {
    if (isLoading) return
    isLoading = id
    const start = performance.now();
    const { userEntity: _user, userFields, authorisedFieldKeys } = await zafDomain.getUser(id)
    setUser(_user)
    const { organizationEntity: _organization } = await zafDomain.getOrganization(_user.organizationId, { userFields, authorisedFieldKeys })
    setOrganization(_organization)
    const patched = await zafDomain.patchUserTickets(_user)
    setUser(patched)

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

  function requesterNameChanged(name: string) {
    setUserName(name)
  }

  React.useEffect(() => {
    zafUtil.on([
      'ticket.requester.name.changed',
    ], requesterNameChanged)
    return () => {
      zafUtil.off([
        'ticket.requester.name.changed',
      ], requesterNameChanged)
    }
  }, [])

  React.useEffect(() => {
    zafUtil.on([
      'ticket.save',
    ], zafDomain.ticketOnSave)
    return () => {
      zafUtil.off([
        'ticket.save',
      ], zafDomain.ticketOnSave)
    }
  }, [])

  React.useEffect(() => {
    zafUtil.resizeWindow()
  })

  if (!user || !organization) return (
    <NoSelectRequesterLabel />
  )
  return (
    <>
      {
        userName || user || organization
          ? <TicketPanel
            userName={userName}
            user={user}
            organization={organization}
          />
          : <AppLoader />
      }
    </>
  )
}

export default App
