import styled from 'styled-components';
import { ServiceType } from "../common/entity";
import { IGardenTheme } from '@zendeskgarden/react-theming';
import React from 'react';
// import { Col, Grid, Row } from '@zendeskgarden/react-grid';
// import { ReactComponent as AlertWarningFillIcon } from '@zendeskgarden/svg-icons/src/16/alert-warning-fill.svg';
// import { Tag } from '@zendeskgarden/react-tags';
import { Alert } from '@zendeskgarden/react-notifications';


type NoSupportServicesProps = {
    types: ServiceType[],
}

// const StyledTag = styled(Tag)`
//     margin: ${p => (p.theme as IGardenTheme).space.xxs} 0;
//     width: 100%;
//     height: auto; 
//     padding: 10px 0;
// `;

// const StyledCol = styled(Col)` 
//     width: initial;
//     padding: auto 4px;
// `

const StyledSpacer = styled.div`
  height: ${p => (p.theme as IGardenTheme).space.xxs};
`;

export const NoSupportServices = ({ types }: NoSupportServicesProps) => {
    return (
        <>
            {types.some((type) => type.noService) &&
                // <StyledTag hue='red' size='large'>
                //     <Grid>
                //         <Row justifyContent="center" alignItems='center'>
                //             <StyledCol style={{ textAlign: 'start' }}>
                //                 <AlertWarningFillIcon style={{ verticalAlign: 'middle' }} />
                //             </StyledCol>
                //             <StyledCol md='auto'>
                //                 {
                //                     types
                //                         .filter((type) => type.noService)
                //                         .map((type) =>
                //                             <div key={type.key}><SM isBold>{type.noService?.name}</SM></div>
                //                         )
                //                 }
                //             </StyledCol>
                //             <StyledCol>
                //             </StyledCol>
                //         </Row>
                //     </Grid>
                // </StyledTag>
                <>
                    <Alert type="error" style={{padding: '10px 40px'}}>
                        {
                            types
                                .filter((type) => type.noService)
                                .map((type) =>
                                    <div key={type.key}>{type.noService?.name}</div>
                                )
                        }
                    </Alert>
                    <StyledSpacer></StyledSpacer>
                </>
            }
        </>
    )
}