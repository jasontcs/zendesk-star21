import React from "react";
import './App.css'
import zafClient from "@app/zendesk/sdk";

import { zafDomain } from "@app/zendesk/common";
import { ServiceType, UserFlagTypeVip } from "@app/zendesk/common/entity";

import { GetTicketResponse } from '@app/zendesk/common/api_model';
import { AppThemeProvider, OrganizationPanel } from '@app/zendesk/components';
import { useImportantContactAlertContext } from "@app/zendesk/components/ImportantContactAlert";

function App() {
  const [requester, setRequester] = React.useState<string | undefined>()
  const [isVip, setIsVip] = React.useState(false)
  const [userFlags, setUserFlags] = React.useState<string[]>([])
  const [organizationServices, setOrganizationServices] = React.useState<ServiceType[]>([])
  const [guideUrl, setGuideUrl] = React.useState<string | undefined>()
  const [specialRequirements, setSpecialRequirements] = React.useState<string | undefined>()
  const { setVisible } = useImportantContactAlertContext()

  const fetchAll = async () => {
    const { ticket }: GetTicketResponse = await zafClient.get("ticket");
    const user = await zafDomain.getUser(ticket.requester.id)
    const organization = await zafDomain.getOrganization(user.organizationId)

    setRequester(ticket.requester.name)

    setIsVip(user.isVip)

    setUserFlags(user.userFlags
      .filter((flag) => !(flag.type instanceof UserFlagTypeVip))
      .map((flag) => flag.name)
    )

    setOrganizationServices(organization.services)

    setGuideUrl(organization.guideUrl)

    setSpecialRequirements(user.specialRequirements)
    
    setVisible(user.isAuthorized || user.isVip)
  };

  React.useEffect(() => {
    fetchAll();
    if (!zafClient.has('app.registered', fetchAll)) {
      zafClient.on('app.registered', fetchAll)
    }
  }, []);

  return (
    <AppThemeProvider>
      <OrganizationPanel
        requester={requester}
        guideUrl={guideUrl}
        isVip={isVip}
        userFlags={userFlags}
        organizationServices={organizationServices}
        specialRequirements={specialRequirements}
      ></OrganizationPanel>
    </AppThemeProvider>
  )
}

export default App
