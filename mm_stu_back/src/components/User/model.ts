import { FromRecord, IFrom, InputProps, User, InputFromType } from "./LoginLayout.type";
import { reactive } from "vue";

export const Icon:
  Record<
    User.AnyFrom,
    InputFromType
  > = {
  //配置每个表单属性对应的图标和表单基础属性(表单类型, 是否显示验证码, 对应正则表达式)
  username: { icon: "user-filling", regex : { rule: /[0-9a-zA-Z]{4,20}/, msg: "用户名数字字母下划线4-20字符" }},
  password: { icon: "port-set", type: "password", 
    regex : { 
      rule : /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=[^0-9a-zA-Z]).{4,20}/, 
      msg: "密码包含大小写数字和特殊字符4-20字符"
    } 
  },
  sms: { icon: "dynamic-filling", showSms: true },
  bpassword: { icon: "port-set", type: "password" },
  mobilephone: { icon: "phone", regex: {
    rule: /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/,
    msg: "请输入正确手机格式"
  }},
}

/**
 * 通过泛型参数来绑定表单的字段 如
 * @param {UserFrom<User.LoginProps>} // username, password, sms;
 */
export class UserFrom<T> {

  //构造函数字符串数组
  private FromArrs: IFrom<T>[] = [];

  //使用 this.Froms.T.bindValue 获取字段
  public Froms = {} as FromRecord<T>;

  public FromData = {} as Record<IFrom<T>,string>;

  constructor(From: IFrom<T>[] ) { this.FromArrs = From; }

  //通过builder方法, Ref绑定 构造函数传来的字符串表单字段 
  public builder(): [FromRecord<T>, () => Record<IFrom<T>,string>] {
    this.FromArrs.map(Input => {
      this.Froms[Input] = this.builderObject(Input as User.AnyFrom);
    });
    return [ reactive(this.Froms), this.builderFromData.bind(this) ];
  }

  private builderFromData() : Record<IFrom<T>,string>{
    for(const K in this.Froms) {
      this.FromData[K] = this.Froms[K].bindvalue;
    }
    return this.FromData;
  }

  private builderObject(e: User.AnyFrom): InputProps {
    return {
      bindvalue: '',
      icon: Icon[e].icon,
      placeholder: e,
      type: Icon[e].type,
      showSms: Icon[e].showSms,
      regex: Icon[e].regex
    }
  }
}

export const FromModel = {
  //将表单需要的属性添加到字符串数组中
  Login: new UserFrom<User.LoginProps>(["username", "password", "sms"]),
  Register: new UserFrom<User.RegisterProps>(["username", "password", "bpassword", "mobilephone", "sms"]),
  Forget: new UserFrom<User.ForgetProps>(["mobilephone", "sms"])
};