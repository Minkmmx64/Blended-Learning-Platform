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