import zafClient from "../sdk/index";

export class ZafUtil {
    async resizeWindow() {
        await zafClient.invoke("resize", { height: document.body.offsetHeight })
    }

    on(eventNames: string[], listener: (...args: any) => any) {
        eventNames.forEach(eventName => {
            if (!zafClient.has(eventName, listener)) {
                zafClient.on(eventName, listener)
            }
        });
    }
}