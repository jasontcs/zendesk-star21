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

  var isLoading = false

  const fetchAll = async () => {
    if (isLoading) return
    isLoading = true
    const start = performance.now();
    const { organization }: GetOrganizationResponse = await zafClient.get("organization");
    if (!organization) zafUtil.showToast('Cannot fetch organization, Please refresh', 'error')
    const { organizationEntity } = await zafDomain.getOrganization(organization.id)
    setOrganizationEntity(organizationEntity)
    const end = performance.now();
    if (await zafUtil.isSandbox()) {
      zafUtil.logFetchTime(start, end, 'Organization Sidebar')
    }
    isLoading = false
  }

  React.useEffect(() => {
    console.log('organization_sidebar', 'useEffect')
    fetchAll();
    zafUtil.on([
      'app.activated',
      'organization.tags.changed',
      'organization.special_requirements.changed',
    ], fetchAll)
    return () => {
      zafUtil.off([
        'app.activated',
        'organization.tags.changed',
        'organization.special_requirements.changed',
      ], fetchAll)
    }
  }, []);

  React.useEffect(() => {
    zafUtil.resizeWindow()
  })

  return (
    <>
      {
        organizationEntity
          ? <OrganizationPanel organization={organizationEntity} />
          : <AppLoader />
      }
    </>

  )
}

export default App