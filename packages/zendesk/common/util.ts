import zafClient from "../sdk/index";

export class ZafUtil {
    resizeWindow() {
        zafClient.invoke("resize", {});
    }
}