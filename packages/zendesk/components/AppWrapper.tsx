import React from "react";
import { AppThemeProvider } from "./AppThemeProvider"
import { ImportantContactAlertProvider } from "./ImportantContactAlert"


type AppWrapperProps = {
    children: React.ReactNode;
}

export const AppWrapper = (props: AppWrapperProps) => {
    return (
        <AppThemeProvider>
            <ImportantContactAlertProvider>
                {props.children}
            </ImportantContactAlertProvider>
        </AppThemeProvider>
    )
}
