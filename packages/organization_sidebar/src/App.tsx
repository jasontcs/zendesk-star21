import { useState } from 'react'
import './App.css'
import React from 'react'
import { zafDomain, zafUtil } from "@app/zendesk/common";
import zafClient from '@app/zendesk/sdk'
import { GetOrganizationResponse } from '@app/zendesk/common/api_model'
import { UserEntity } from '@app/zendesk/common/entity';
import { ImportantContactList } from '@app/zendesk/components';


function App() {
  const [authorizedUsers, setAuthorizedUsers] = useState<UserEntity[]>([])

  const fetchAll = async () => {
    const { organization }: GetOrganizationResponse = await zafClient.get("organization");
    const { importantContacts } = await zafDomain.getOrganization(organization.id)
    setAuthorizedUsers(importantContacts)
    zafUtil.resizeWindow()
  }

  React.useEffect(() => {
    fetchAll()
    if (!zafClient.has('app.registered', fetchAll)) {
      zafClient.on('app.registered', fetchAll)
    }
  }, []);

  return (
    <ImportantContactList authorizedUsers={authorizedUsers} ></ImportantContactList>
  )
}

export default App