import { IGardenTheme } from "@zendeskgarden/react-theming";
import { MD } from "@zendeskgarden/react-typography"
import React from "react"
import styled from "styled-components";

export const NoOrganizationLabel = () => {
    const StyledSpacer = styled.div`
    height: ${p => (p.theme as IGardenTheme).space.xs};
  `;

    return (
        <>
            <MD style={{ textAlign: "center" }}>No organisation found! Please verify the user information first, e.g. email address. If the user information is correct search Google and Zendesk for this business to determine if the organisation already exists before creating a new organisation</MD>
            <StyledSpacer></StyledSpacer>
        </>
    )
}