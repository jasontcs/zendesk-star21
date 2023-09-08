/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React from "react"
import { Button } from '@zendeskgarden/react-buttons';
import { Modal, Body } from '@zendeskgarden/react-modals';
import { Row, Col } from '@zendeskgarden/react-grid';
import { Tag } from '@zendeskgarden/react-tags';
import { LG, MD, Paragraph, Span } from '@zendeskgarden/react-typography';

type ImportantContactAlertProps = {
    isVip: boolean,
    isAuthorised: boolean,
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
    const [visible, setVisible] = React.useState(true);
    return (
        <ImportantContactAlertContext.Provider value={{
            visible,
            setVisible,
        }}>
            {children}
        </ImportantContactAlertContext.Provider>
    );
};

export const ImportantContactAlert = ({ isVip, isAuthorised, children }: ImportantContactAlertProps) => {
    const { visible, setVisible } = useImportantContactAlertContext()
    return (
        <Row>
            <Col>
                {children}
                {visible && (
                    <Modal onClose={() => setVisible(false)}>
                        <Body>
                            <Paragraph>
                                <LG>
                                    <Span isBold>Important Requester!</Span>
                                </LG>
                            </Paragraph>
                            <Paragraph>
                                <MD>Name: <Span isBold>Butterworth, Paul</Span></MD>
                                <MD>Types:
                                    {
                                        isVip &&
                                        <>
                                            <Tag hue='yellow' style={{ marginLeft: '4px' }}>
                                                <Span>VIP</Span>
                                            </Tag>
                                        </>
                                    }
                                    {
                                        isAuthorised &&
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
    );
};
