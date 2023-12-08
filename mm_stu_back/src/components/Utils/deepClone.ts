//深拷贝一个对象
export function DeepClone(obj: any): any {
  const T = getType(obj);
  let o: any;
  if(T === "[object Array]") {
    o = [];
    for(let i = 0; i < obj.length; i ++){
      const t = obj[i];
      o[i] = DeepClone(obj[i]);
    }
  }else if(T === "[object Object]") {
    o = {};
    for(const K in obj) {
      o[K] = DeepClone(obj[K]);
    }
  }
  return obj;
}

const getType = (v: any) => {
  return Object.prototype.toString.call(v);
}