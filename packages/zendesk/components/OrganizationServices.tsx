import { Tag } from '@zendeskgarden/react-tags';
import { Body, Cell, Row as TableRow, Table } from '@zendeskgarden/react-tables';
import { MD, Span } from '@zendeskgarden/react-typography';
import { ServiceEntity, ServiceType } from "../common/entity";



type OrganizationServicesProps = {
    organizationServices: ServiceEntity[],
}

export const OrganizationServices = ({ organizationServices }: OrganizationServicesProps) => {
    return (
        <Table size="small">
            <Body>
                {
                    organizationServices
                        .filter((service) => service.type)
                        .sort((a, b) => Object.values(ServiceType).indexOf(a.type!) - Object.values(ServiceType).indexOf(b.type!))
                        .map((service, index) =>
                            <TableRow isFocused={false} key={service.id} isStriped={index % 2 === 0}>
                                <Cell width="100px" style={{ textAlign: "center" }}>
                                    <Tag hue={service.color} style={{ width: "100%" }}>
                                        <span>{service.typeTitle}</span>
                                    </Tag>
                                </Cell>
                                <Cell style={{ textAlign: "right" }}>
                                    <MD isBold>
                                        <Span hue={service.color}>{service.name}</Span>
                                    </MD>
                                </Cell>
                            </TableRow>
                        )
                }
            </Body>
        </Table>
    )
}