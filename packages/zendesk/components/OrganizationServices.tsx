import { Tag } from '@zendeskgarden/react-tags';
import { Body, Cell, Row as TableRow, Table } from '@zendeskgarden/react-tables';
import { MD, Span } from '@zendeskgarden/react-typography';
import { ServiceEntity, ServiceType } from "../common/entity";
import React from 'react';



type OrganizationServicesProps = {
    organizationServices: ServiceType[],
}

export const OrganizationServices = ({ organizationServices }: OrganizationServicesProps) => {
    return (
        <Table size="small">
            <Body>
                {
                    organizationServices
                        .filter((type) => !type.noService)
                        .flatMap((type) => type.items.map((service) => [type, service] as [ServiceType, ServiceEntity])
                        ).map((service, index) =>
                            <TableRow isFocused={false} key={service[1].id} isStriped={index % 2 == 0}>
                                <Cell width="100px" style={{ textAlign: "center" }}>
                                    <Tag hue={service[0].color} style={{ width: "100%" }}>
                                        <span>{service[0].title}</span>
                                    </Tag>
                                </Cell>
                                <Cell style={{ textAlign: "right" }}>
                                    <MD>
                                        <Span isBold>{service[1].name}</Span>
                                    </MD>
                                </Cell>
                            </TableRow>
                        )
                }
            </Body>
        </Table>
    )
}