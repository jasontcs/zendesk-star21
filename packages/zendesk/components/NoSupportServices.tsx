import styled from 'styled-components';
import { Alert, Title } from '@zendeskgarden/react-notifications';
import { ServiceType } from "../common/entity";
import { Span } from '@zendeskgarden/react-typography';
import { IGardenTheme } from '@zendeskgarden/react-theming';

type NoSupportServicesProps = {
    types: ServiceType[],
}

const StyledSpacer = styled.div`
  height: ${p => (p.theme as IGardenTheme).space.xs};
`;
export const NoSupportServices = ({ types }: NoSupportServicesProps) => {
    return (
        <>
            {types.some((type) => type.noService) &&
                <>
                    <StyledSpacer></StyledSpacer>
                    <Alert type="error">
                        <Title>Warning</Title>
                        {
                            types
                            .filter((type) => type.noService)
                            .map((type) =>
                                <div key={type.key}><Span>{type.noService?.name}</Span></div>
                            )
                        }
                    </Alert>
                    <StyledSpacer></StyledSpacer>
                </>
            }
        </>
    )
}