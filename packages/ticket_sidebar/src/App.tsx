import React from "react";
import './App.css'
import zafClient from "@app/zendesk/sdk";

import { zafDomain, zafUtil } from "@app/zendesk/common";
import { OrganizationEntity, UserEntity } from "@app/zendesk/common/entity";

import { GetTicketResponse } from '@app/zendesk/common/api_model';
import { AppLoader, TicketPanel } from '@app/zendesk/components';
import { useImportantContactAlertContext } from "@app/zendesk/components/ImportantContactAlert";

function App() {
  const [user, setUser] = React.useState<UserEntity | undefined>()
  const [organization, setOrganization] = React.useState<OrganizationEntity | undefined>()
  const { setVisible } = useImportantContactAlertContext()
  const [userName, setUserName] = React.useState<string | undefined>()

  var isLoading = false

  const fetchAll = async () => {
    if (isLoading) return
    isLoading = true
    const start = performance.now();
    const { ticket }: GetTicketResponse = await zafClient.get("ticket");
    if (!ticket) zafUtil.showToast('Cannot fetch ticket, Please refresh', 'error')
    setUserName(ticket.requester.name)
    const { userEntity: _user, userFields, authorisedFieldKeys } = await zafDomain.getUser(ticket.requester.id)
    setUser(_user)
    const { organizationEntity: organization } = await zafDomain.getOrganization(_user.organizationId, { userFields, authorisedFieldKeys })
    setOrganization(organization)
    const patched = await zafDomain.patchUserTickets(_user)
    setUser(patched)

    if (
      (!user?.isVip || !user?.isAuthorized) &&
      (_user.isVip || _user.isAuthorized)
    ) {
      setVisible(true)
    }
    const end = performance.now();
    if (await zafUtil.isSandbox()) {
      zafUtil.logFetchTime(start, end, 'Ticket Sidebar')
    }
    isLoading = false
  };

  React.useEffect(() => {
    console.log('ticket_sidebar', 'useEffect')
    fetchAll();
    zafUtil.on([
      'app.activated',
      'ticket.requester.id.changed',
    ], fetchAll)
    return () => {
      zafUtil.off([
        'app.activated',
        'ticket.requester.id.changed',
      ], fetchAll)
    }
  }, []);

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
    zafUtil.resizeWindow()
  })

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
