import { ToastShowOptions } from "./Toast.type";

interface EventSub {
  show: ToastShowOptions;
  hide: null;
}



export class ToastObserver {

  private listener = {} as { [index in keyof EventSub] : Function[] };

  public on<U extends keyof EventSub>(event: U, callBack: (payload: EventSub[U]) => void) {
    if(this.listener[event] === undefined || this.listener[event].length < 1)
      this.listener[event] = [];
    this.listener[event].push(callBack);
  }

  public emit<U extends keyof EventSub>(event: U, payload: EventSub[U]) {
    if(this.listener[event] && this.listener[event].length) {
      this.listener[event].forEach( e => e(payload));
    }
  }

}


export default new ToastObserver();