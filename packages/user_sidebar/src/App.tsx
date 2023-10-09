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
  const [userName, setUserName] = React.useState<string | undefined>()

  var isLoading = false

  const fetchAll = async () => {
    if (isLoading) return
    isLoading = true
    const start = performance.now();
    const { user: userRaw }: GetUserResponse = await zafClient.get("user");
    if (!userRaw) zafUtil.showToast('Cannot fetch user, Please refresh', 'error')
    setUserName(userRaw.name)
    const { userEntity: _user, userFields, authorisedFieldKeys } = await zafDomain.getUser(userRaw.id)
    setUser(_user)
    const { organizationEntity: _organization } = await zafDomain.getOrganization(_user.organizationId, { userFields, authorisedFieldKeys })
    setOrganization(_organization)

    if (
      (!user?.isVip || !user?.isAuthorized) &&
      (_user.isVip || _user.isAuthorized)
    ) {
      setVisible(true)
    }

    const end = performance.now();
    if (await zafUtil.isSandbox()) {
      zafUtil.logFetchTime(start, end, 'User Sidebar')
    }
    isLoading = false
  };

  React.useEffect(() => {
    console.log('user_sidebar', 'useEffect')
    fetchAll();
    zafUtil.on([
      'app.activated',
      'user.tags.changed',
      'user.special_requirements.changed',
    ], fetchAll)
    return () => {
      zafUtil.off([
        'app.activated',
        'user.tags.changed',
        'user.special_requirements.changed',
      ], fetchAll)
    }
  }, []);

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
