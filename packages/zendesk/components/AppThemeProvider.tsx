import { DEFAULT_THEME } from "@zendeskgarden/react-theming";
import { ThemeProvider } from "styled-components";

type AppThemeProviderProps = {
    children: React.ReactNode;
};
const theme = {
    ...DEFAULT_THEME,
}

export const AppThemeProvider = (props: AppThemeProviderProps) => {
    return (
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>
    )
}
