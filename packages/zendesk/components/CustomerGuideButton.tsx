
import { Button } from '@zendeskgarden/react-buttons';
import { Spinner } from '@zendeskgarden/react-loaders';
import React from 'react';

type CustomerGuideButtonProps = {
    isLoading: boolean
    guideUrl: string | undefined,
}

export const CustomerGuideButton = ({ guideUrl, isLoading }: CustomerGuideButtonProps) => {
    return (
        <>
            <p></p>
            <a href={guideUrl} target="_blank">
                <Button isPrimary isStretched disabled={guideUrl == null}>{isLoading ? <Spinner /> : 'Customer Guide'}</Button>
            </a>
        </>
    )
}