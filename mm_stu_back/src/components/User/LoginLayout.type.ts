export namespace User {
  
  /** 登录表单 */
  export interface LoginProps {
    //用户名
    username: InputProps;
    //密码
    password: InputProps;
    //验证码
    sms: InputProps;
  }

  /** 忘记密码 */
  export interface ForgetProps {
    //密码
    password: InputProps;
    //重复密码
    bpassword: InputProps;
    //手机号
    mobilephone: InputProps;
    //验证码
    sms: InputProps;
  }

  /** 注册表单 */
  export interface RegisterProps {
    //用户名
    username: InputProps;
    //密码
    password: InputProps;
    //重复密码
    bpassword: InputProps;
    //手机号
    mobilephone: InputProps;
    //验证码
    sms: InputProps;
  }

  export type AnyFrom = IFrom<LoginProps & RegisterProps & ForgetProps>;
}

export type InputProps = InputFromProps & InputFromType;

/** 表单属性 */
export interface InputFromProps {
  //表单描述
  placeholder: string;
  //绑定输入
  bindvalue: string;
}

export type CustomRegex = {
  rule: RegExp;
  msg: string;
}

//显示表单
export interface InputFromType { 
  //表单图标
  icon: string, 
  //表单类型，默认text
  type?: string,
  //是否显示图形验证码
  showSms?: boolean
  //正则表达式
  regex ?: CustomRegex;
}

export type IFrom<T> = keyof T;

export type FromRecord<T> = Record<IFrom<T>, InputProps>;