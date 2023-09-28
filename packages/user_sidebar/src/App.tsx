import React from "react";
import './App.css'
import zafClient from "@app/zendesk/sdk";

import { zafDomain, zafUtil } from "@app/zendesk/common";
import { OrganizationEntity, UserEntity } from "@app/zendesk/common/entity";

import { GetUserResponse } from '@app/zendesk/common/api_model';
import { AppLoader, TicketPanel } from '@app/zendesk/components';
import { useImportantContactAlertContext } from "@app/zendesk/components/ImportantContactAlert";

function App() {
  const [user, setUser] = React.useState<UserEntity | undefined>()
  const [organization, setOrganization] = React.useState<OrganizationEntity | undefined>()
  const { setVisible } = useImportantContactAlertContext()

  const fetchAll = async () => {
    const start = performance.now();
    const { user: userRaw }: GetUserResponse = await zafClient.get("user");
    if (!userRaw) zafUtil.showToast('Cannot fetch user, Please refresh', 'error')
    const _user = await zafDomain.getUser(userRaw.id)
    setUser(_user)
    zafUtil.resizeWindow()
    const _organization = await zafDomain.getOrganization(_user.organizationId)
    setOrganization(_organization)
    zafUtil.resizeWindow()

    if (
      (!user?.isVip || !user?.isAuthorized) &&
      (_user.isVip || _user.isAuthorized)
    ) {
      setVisible(true)
    }

    zafUtil.resizeWindow()
    const end = performance.now();
    zafUtil.logFetchTime(start, end)
  };

  React.useEffect(() => {
    if (zafUtil.isDev) {
      fetchAll();
    }
    zafUtil.on([
      'app.activated',
      'user.tags.changed',
      'user.special_requirements.changed',
    ], fetchAll)
  }, []);

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
