import { Tag } from '@zendeskgarden/react-tags';
import { Body, Cell, Row as TableRow, Table } from '@zendeskgarden/react-tables';
import { MD, Span } from '@zendeskgarden/react-typography';
import { ServiceEntity, ServiceType } from "../common/entity";
import React from 'react';
import styled from 'styled-components';
import { IGardenTheme } from '@zendeskgarden/react-theming';



type OrganizationServicesProps = {
    organizationServices: ServiceType[],
}

const StyledSpacer = styled.div`
  height: ${p => (p.theme as IGardenTheme).space.xxs};
`;

export const OrganizationServices = ({ organizationServices }: OrganizationServicesProps) => {
    return (
        <>
            <StyledSpacer /><Table size="small">
                <Body>
                    {organizationServices
                        .filter((type) => !type.noService)
                        .flatMap((type) => type.items.map((service) => [type, service] as [ServiceType, ServiceEntity])
                        ).map((service, index) => <TableRow isFocused={false} key={service[1].id} isStriped={index % 2 == 0} style={{ height: 'initial' }}>
                            <Cell width="100px" style={{ textAlign: "center", paddingBlock: '2px' }}>
                                <Tag hue={service[0].color} style={{ width: "100%" }}>
                                    <span>{service[0].title}</span>
                                </Tag>
                            </Cell>
                            <Cell style={{ textAlign: "right", paddingBlock: '2px' }}>
                                <MD>
                                    <Span isBold>{service[1].name}</Span>
                                </MD>
                            </Cell>
                        </TableRow>
                        )}
                </Body>
            </Table>
        </>
    )
}