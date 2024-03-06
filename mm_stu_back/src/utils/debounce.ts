export function debounce(cb : (...args: any) => void, delay: number) {
  let time: any;
  return function(...args: any) {
    if(time) clearTimeout(time);
    else {
      time = setTimeout(() => {
        cb.apply(this, args)
      }, delay);
    }
  }
}

//函数防抖
// export function debounce<A extends any[], R> (fn: (...args : A) => R, timeout: number = 1000) {
//   let time: NodeJS.Timeout | null = null;
//   return function(...args: A) {
//     time = setTimeout(() => {
//       if(time)
//         clearTimeout(time);
//       fn(...args);
//     }, timeout);
//   }
// }

//函数节流
export function throttle<A extends any[], R>(fn: (...args: A) => R, interval: number = 1000) {
  let time: NodeJS.Timeout | null = null;
  return function(...args : A){
    if(!time) {
      time = setTimeout(() => {
        fn(...args);
        time = null;
      }, interval);
    }
  }
}