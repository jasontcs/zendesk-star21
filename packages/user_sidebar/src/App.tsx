import React from "react";
import './App.css'
import zafClient from "@app/zendesk/sdk";

import { zafDomain, zafUtil } from "@app/zendesk/common";
import { OrganizationEntity, UserEntity } from "@app/zendesk/common/entity";

import { GetUserResponse } from '@app/zendesk/common/api_model';
import { TicketPanel } from '@app/zendesk/components';
import { useImportantContactAlertContext } from "@app/zendesk/components/ImportantContactAlert";

function App() {
  const [user, setUser] = React.useState<UserEntity | undefined>()
  const [organization, setOrganization] = React.useState<OrganizationEntity | undefined>()
  const { setVisible } = useImportantContactAlertContext()

  const fetchAll = async () => {
    const { user:userRaw }: GetUserResponse = await zafClient.get("user");
    const _user = await zafDomain.getUser(userRaw.id)
    const _organization = await zafDomain.getOrganization(_user.organizationId)

    console.log('---')
    console.log(user)
    console.log(_user.isAuthorized)
    console.log('---')
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
      'user.tags.changed'
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
