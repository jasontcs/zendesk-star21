import React from "react"
import { Button } from '@zendeskgarden/react-buttons';
import { Modal, Body } from '@zendeskgarden/react-modals';
import { Grid, Row, Col } from '@zendeskgarden/react-grid';
import { Tag } from '@zendeskgarden/react-tags';
import { LG, MD, Paragraph, Span } from '@zendeskgarden/react-typography';
import { UserEntity } from "../common/entity";

type ImportantContactAlertProps = {
    user: UserEntity,
    children: React.ReactNode;
}

export const ImportantContactAlertContext = React.createContext<{
    visible: boolean
    setVisible: (c: boolean) => void
}>({
    visible: false,
    setVisible: () => null,
})

export const useImportantContactAlertContext = () => React.useContext(ImportantContactAlertContext)

export const ImportantContactAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [visible, setVisible] = React.useState(false);
    return (
        <ImportantContactAlertContext.Provider value={{
            visible,
            setVisible,
        }}>
            {children}
        </ImportantContactAlertContext.Provider>
    );
};

export const ImportantContactAlert = ({ user, children }: ImportantContactAlertProps) => {
    const { visible, setVisible } = useImportantContactAlertContext()
    return (
        <Grid gutters={false}>
            <Row>
                <Col>
                    {children}
                    {false && visible && (
                        <Modal onClose={() => setVisible(false)}>
                            <Body>
                                <Paragraph>
                                    <LG>
                                        <Span isBold>Important Requester!</Span>
                                    </LG>
                                </Paragraph>
                                <Paragraph>
                                    <MD>Name: <Span isBold>{user.name}</Span></MD>
                                    <MD>Types:
                                        {
                                            user.isVip &&
                                            <>
                                                <Tag hue='yellow' style={{ marginLeft: '4px' }}>
                                                    <Span>VIP</Span>
                                                </Tag>
                                            </>
                                        }
                                        {
                                            user.isAuthorized &&
                                            <>
                                                <Tag hue='green' style={{ marginLeft: '4px' }}>
                                                    <Span>Authorised</Span>
                                                </Tag>
                                            </>
                                        }
                                    </MD>
                                </Paragraph>
                                <Paragraph>
                                    <Button isBasic onClick={() => setVisible(false)} size='small' style={{ width: '100%' }}>
                                        Dismiss
                                    </Button>
                                </Paragraph>
                            </Body>
                        </Modal>
                    )}
                </Col>
            </Row>
        </Grid>
    );
};
