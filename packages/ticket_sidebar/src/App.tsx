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

  var isLoading = false

  const fetchAll = async () => {
    if (isLoading) return
    isLoading = true
    const start = performance.now();
    const { ticket }: GetTicketResponse = await zafClient.get("ticket");
    if (!ticket) zafUtil.showToast('Cannot fetch ticket, Please refresh', 'error')
    const _user = await zafDomain.getUser(ticket.requester.id)
    setUser(_user)
    const _organization = await zafDomain.getOrganization(_user.organizationId)
    setOrganization(_organization)

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
    ], fetchAll)
    return () => {
      zafUtil.off([
        'app.activated',
      ], fetchAll)
    }
  }, []);

  React.useEffect(() => {
    zafUtil.resizeWindow()
  })

  return (
    <>
      {
        user && organization
          ? <TicketPanel
            user={user}
            organization={organization}
          ></TicketPanel>
          : <AppLoader></AppLoader>
      }
    </>
  )
}

export default App
