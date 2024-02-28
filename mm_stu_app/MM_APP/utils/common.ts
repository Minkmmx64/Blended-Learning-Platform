import moment from "moment";
import { Dimensions, Platform } from "react-native";

export function isAndroid() {
  return Platform.OS === "android";
}

export const navBarHeight = isAndroid() ? 56 : 44;

//设备宽度
export const Device_W = Dimensions.get("window").width;

//设备高度
export const Device_H = Dimensions.get("window").height;

//
export const rpx = (val: number) => val * (Device_W / 750);


//深拷贝一个对象
export function DeepClone(obj: any): any {
  const T = getType(obj);
  let o = obj;
  if(T === "[object Array]") {
    o = [];
    for(let i = 0; i < obj.length; i ++){
      //const t = obj[i];
      o[i] = DeepClone(obj[i]);
    }
  }else if(T === "[object Object]") {
    o = {};
    for(const K in obj) {
      o[K] = DeepClone(obj[K]);
    }
  }
  return o;
}

const getType = (v: any) => {
  return Object.prototype.toString.call(v);
}


export const Rules = {
  username : {
    rule: new RegExp(/[0-9a-zA-Z]{4,20}/),
    msg : "用户名数字字母下划线4-20字符"
  },
  password : {
    rule: new RegExp(/((?=.*[^0-9a-zA-Z])(?=.*[a-zA-Z])(?=.*[0-9])).{4,20}/),
    msg : "密码包含大小写数字和特殊字符4-20字符"
  },
  phone : {
    rule : new RegExp(/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/),
    msg : "请输入正确手机格式"
  },
  img : {
    rule: new RegExp(/(http|https):\/\/([a-z0-9A-Z]{1,}(\:[0-9]{1,6})?)(\.[a-z0-9A-Z]{1,})*((\/[a-z0-9A-Z]{1,}){1,})([^/]*)(?=\.png|\.jpg|\.jpeg|\.webp)(\.png|\.jpg|\.jpeg|\.webp)$/),
    msg : "图片格式非法"
  },
  suff: {
    rule: new RegExp(/(?!.*\.).*/),
    msg: "文件后缀名"
  }
}

//延迟函数
export const sleep = (timeout: number = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(void 0);
    }, timeout);
  })
}


//函数防抖
export function debounce<A extends any[], R> (fn: (...args : A) => R, timeout: number) {
  let time: NodeJS.Timeout | null = null;
  return function(...args: A) {
    time = setTimeout(() => {
      if(time)
        clearTimeout(time);
      fn(...args);
    }, timeout);
  }
}

//函数节流


// 时间转化成 yyyy-mm-dd
export function DateTransform(date: string) {
  return moment(date).format("YYYY-MM-DD");
}

//设备宽度参数转化成rpx
export const devices_w_to_rpx = (value: number) => rpx(750) * value / Device_W;
//设备高度参数转化成rpx
export const devices_h_to_rpx = (value: number) => rpx(750) * value / Device_H;