import { Tag } from '@zendeskgarden/react-tags';
import { Body, Cell, Row as TableRow, Table } from '@zendeskgarden/react-tables';
import { MD, Span } from '@zendeskgarden/react-typography';
import { ServiceType } from "../common/entity";



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
                        .flatMap((type) => type.items
                            .map((service) => 
                            <TableRow isFocused={false} key={service.id}>
                                <Cell width="100px" style={{ textAlign: "center" }}>
                                    <Tag hue={type.color} style={{ width: "100%" }}>
                                        <span>{type.title}</span>
                                    </Tag>
                                </Cell>
                                <Cell style={{ textAlign: "right" }}>
                                    <MD isBold>
                                        <Span hue={type.color}>{service.name}</Span>
                                    </MD>
                                </Cell>
                            </TableRow>
                            )
                        )
                }
            </Body>
        </Table>
    )
}