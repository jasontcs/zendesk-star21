
import { Button } from '@zendeskgarden/react-buttons';

type CustomerGuideButtonProps = {
    guideUrl: string | undefined,
}

export const CustomerGuideButton = ({ guideUrl }: CustomerGuideButtonProps) => {
    return (
        <>
            <p></p>
            <a href={guideUrl} target="_blank">
                <Button isPrimary isStretched disabled={guideUrl == null}>Customer Guide</Button>
            </a>
        </>
    )
}