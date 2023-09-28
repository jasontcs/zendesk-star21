import { zafUtil } from ".";
import zafClient from "../sdk/index";

export class ZafUtil {
  async resizeWindow() {
    await new Promise(f => setTimeout(f, 0))
    const height = document.body.offsetHeight
    await zafClient.invoke("resize", { height: height + 5 })
  }

  on(eventNames: string[], listener: (...args: any) => any) {
    eventNames.forEach(eventName => {
      if (!zafClient.has(eventName, listener)) {
        zafClient.on(eventName, listener)
      }
    });
  }
  numDaysBetween = function (d1: Date, d2: Date) {
    var diff = Math.abs(d1.getTime() - d2.getTime());
    return diff / (1000 * 60 * 60 * 24);
  };
  groupBy<K, V>(array: V[], grouper: (item: V) => K) {
    return array.reduce((store, item) => {
      var key = grouper(item)
      if (!store.has(key)) {
        store.set(key, [item])
      } else {
        store.get(key)!.push(item)
      }
      return store
    }, new Map<K, V[]>())
  }
  logFetchTime = (start: number, end: number) => {
    const total = (Math.round((end - start) / 1000 * 100) / 100).toFixed(2);
    zafUtil.showToast('Data Loaded in ' + total + ' seconds.', 'notice')
  }

  isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

  isSandbox = async () => {
    const response = await zafClient.get('currentAccount.subdomain')
    return response['currentAccount.subdomain'] != 'star21cloud'
  }

  showToast = async <U>(message: string, type: 'notice' | 'alert' | 'error') => {
    return await zafClient.invoke<U>('notify', message, type, 4000)
  }
}