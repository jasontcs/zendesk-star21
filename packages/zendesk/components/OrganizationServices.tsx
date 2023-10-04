import { Tag } from '@zendeskgarden/react-tags';
import { Body, Cell, Row as TableRow, Table } from '@zendeskgarden/react-tables';
import { MD, Span } from '@zendeskgarden/react-typography';
import { ServiceType } from "../common/entity";
import React from 'react';
import { Accordion } from '@zendeskgarden/react-accordions';



type OrganizationServicesProps = {
    organizationServices: ServiceType[],
}

export const OrganizationServices = ({ organizationServices }: OrganizationServicesProps) => {
    const validServices = organizationServices
        .filter((type) => !type.noService)
    return (
        <Body>
            <Accordion level={validServices.length} isCompact>
                {
                    validServices
                        .map((type) =>
                            <Accordion.Section>
                                <Accordion.Header>
                                    <Accordion.Label style={{ padding: '6px' }}>
                                        <Tag hue={type.color} size='large' style={{ width: '100%' }}>
                                            <Span>{type.title}</Span>
                                        </Tag>
                                    </Accordion.Label>
                                </Accordion.Header>
                                <Accordion.Panel style={{ padding: '0' }}>
                                    <Table size="small">
                                        {type.items.map((item, index) =>
                                            <TableRow isFocused={false} key={item.id} isStriped={index % 2 == 0}>
                                                <Cell style={{ textAlign: "left" }}>
                                                    <MD>
                                                        <Span isBold>{item.name}</Span>
                                                    </MD>
                                                </Cell>
                                            </TableRow>)}
                                    </Table>
                                </Accordion.Panel>
                            </Accordion.Section>
                        )
                }
            </Accordion>
        </Body>
    )
}