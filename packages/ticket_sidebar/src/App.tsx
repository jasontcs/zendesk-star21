import React from "react";
import './App.css'
import zafClient from "@app/zendesk/sdk";

import { zafDomain, zafUtil } from "@app/zendesk/common";
import { OrganizationEntity, UserEntity } from "@app/zendesk/common/entity";

import { GetTicketResponse } from '@app/zendesk/common/api_model';
import { TicketPanel } from '@app/zendesk/components';
import { useImportantContactAlertContext } from "@app/zendesk/components/ImportantContactAlert";

function App() {
  const [user, setUser] = React.useState<UserEntity | undefined>()
  const [organization, setOrganization] = React.useState<OrganizationEntity | undefined>()
  const { setVisible } = useImportantContactAlertContext()

  const fetchAll = async () => {
    const { ticket }: GetTicketResponse = await zafClient.get("ticket");
    const _user = await zafDomain.getUser(ticket.requester.id)
    const _organization = await zafDomain.getOrganization(_user.organizationId)

    if (
      (!user?.isVip || !user?.isAuthorized) &&
      (_user.isVip || _user.isAuthorized)
    ) {
      setVisible(true)
    }

    setUser(_user)
    setOrganization(_organization)
    zafUtil.resizeWindow()
  };

  React.useEffect(() => {
    fetchAll();
    zafUtil.on([
      'app.registered', 
      'app.activated',
      '*.changed'
    ], fetchAll)
  }, []);

  return (
    <>
      {user && organization &&
        <TicketPanel
          user={user}
          organization={organization}
        ></TicketPanel>
      }
    </>
  )
}

export default App
