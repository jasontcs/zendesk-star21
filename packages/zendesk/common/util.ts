import zafClient from "../sdk/index";

export class ZafUtil {
    async resizeWindow() {
        await zafClient.invoke("resize", { height: document.body.offsetHeight })
    }
}