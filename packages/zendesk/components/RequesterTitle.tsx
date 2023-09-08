
import { XL } from '@zendeskgarden/react-typography';

type RequesterTitleProps = {
    requester: string | undefined,
}

export const RequesterTitle = ({ requester }: RequesterTitleProps) => {
    return (
        <>  
            <p></p>
            <XL isBold style={{ textAlign: "center" }}>{requester}</XL>
            <hr />
        </>
    )
}