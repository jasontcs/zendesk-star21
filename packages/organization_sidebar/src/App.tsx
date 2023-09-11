import { useState } from 'react'
import './App.css'
import React from 'react'
import { zafDomain, zafUtil } from "@app/zendesk/common";
import zafClient from '@app/zendesk/sdk'
import { GetOrganizationResponse } from '@app/zendesk/common/api_model'
import { OrganizationEntity } from '@app/zendesk/common/entity';
import { OrganizationPanel } from '@app/zendesk/components';


function App() {
  const [organizationEntity, setOrganizationEntity] = useState<OrganizationEntity | undefined>()

  const fetchAll = async () => {
    const { organization }: GetOrganizationResponse = await zafClient.get("organization");
    setOrganizationEntity(await zafDomain.getOrganization(organization.id))
    zafUtil.resizeWindow()
  }

  React.useEffect(() => {
    fetchAll()
    zafUtil.on([
      'app.registered',
      'app.activated',
      '*.changed',
    ], fetchAll)
  }, []);

  return (
    <>
      {organizationEntity && <OrganizationPanel organization={organizationEntity}></OrganizationPanel>}
    </>

  )
}

export default App