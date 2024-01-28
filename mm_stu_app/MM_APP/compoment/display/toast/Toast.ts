import ToastObserver from './ToastObserver';

export const Toast = {
  show(title: string, message?: string) {
    return ToastObserver.emit("show", {
      title,
      message: message ?? ""
    });
  },
  hide() {
    return ToastObserver.emit("hide", null);
  }
}