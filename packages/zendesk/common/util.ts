import zafClient from "../sdk/index";

export class ZafUtil {
    async resizeWindow() {
        await zafClient.invoke("resize", { height: document.body.offsetHeight + 5 })
    }

    on(eventNames: string[], listener: (...args: any) => any) {
        eventNames.forEach(eventName => {
            if (!zafClient.has(eventName, listener)) {
                zafClient.on(eventName, listener)
            }
        });
    }
    numDaysBetween = function(d1: Date, d2: Date) {
        var diff = Math.abs(d1.getTime() - d2.getTime());
        return diff / (1000 * 60 * 60 * 24);
    };
}