export const Rules = {
  username : {
    rule: new RegExp(/[0-9a-zA-Z]{4,20}/),
    msg : "用户名数字字母下划线4-20字符"
  },
  password : {
    rule: new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=[^0-9a-zA-Z]).{4,20}/),
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
