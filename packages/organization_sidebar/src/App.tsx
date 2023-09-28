import { useState } from 'react'
import './App.css'
import React from 'react'
import { zafDomain, zafUtil } from "@app/zendesk/common";
import zafClient from '@app/zendesk/sdk'
import { GetOrganizationResponse } from '@app/zendesk/common/api_model'
import { OrganizationEntity } from '@app/zendesk/common/entity';
import { AppLoader, OrganizationPanel } from '@app/zendesk/components';


function App() {
  const [organizationEntity, setOrganizationEntity] = useState<OrganizationEntity | undefined>()

  const fetchAll = async () => {
    const start = performance.now();
    const { organization }: GetOrganizationResponse = await zafClient.get("organization");
    if (!organization) zafUtil.showToast('Cannot fetch organization, Please refresh', 'error')
    setOrganizationEntity(await zafDomain.getOrganization(organization.id))
    zafUtil.resizeWindow()
    const end = performance.now();
    if (await zafUtil.isSandbox()) {
      zafUtil.logFetchTime(start, end)
    }
  }

  React.useEffect(() => {
    fetchAll();
    zafUtil.on([
      'app.activated',
      'organization.tags.changed',
      'organization.special_requirements.changed',
    ], fetchAll)
  }, []);

  return (
    <>
      {
        organizationEntity
          ? <OrganizationPanel organization={organizationEntity}></OrganizationPanel>
          : <AppLoader></AppLoader>
      }
    </>

  )
}

export default App