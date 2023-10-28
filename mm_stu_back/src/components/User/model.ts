import { FromRecord, IFrom, InputProps, User, InputFromType } from "./LoginLayout.type";
import { reactive } from "vue";

const Icon:
  Record<
    User.AnyFrom,
    InputFromType
  > = {
  //配置每个表单属性对应的图标和表单基础属性(表单类型, 是否显示验证码)
  username: { icon: "user-filling" },
  password: { icon: "port-set", type: "password" },
  sms: { icon: "dynamic-filling", showSms: true },
  bpassword: { icon: "port-set", type: "password" },
  mobilephone: { icon: "phone" },
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

  constructor(From: IFrom<T>[]) { this.FromArrs = From; }

  //通过builder方法, Ref绑定 构造函数传来的字符串表单字段 
  public builder(): [FromRecord<T>, () => Record<IFrom<T>,string>] {
    this.FromArrs.map(Input => this.Froms[Input] = this.builderObject(Input as User.AnyFrom));
    return [ reactive(this.Froms), this.builderFromData.bind(this) ];
  }

  private builderFromData() : Record<IFrom<T>,string>{
    for(const K in this.Froms) this.FromData[K] = this.Froms[K].bindvalue;
    return this.FromData;
  }

  private builderObject(e: User.AnyFrom): InputProps {
    return {
      bindvalue: '',
      icon: Icon[e].icon,
      placeholder: e,
      type: Icon[e].type,
      showSms: Icon[e].showSms
    }
  }
}

export const FromModel = {
  //将表单需要的属性添加到字符串数组中
  Login: new UserFrom<User.LoginProps>(["username", "password", "sms"]),
  Register: new UserFrom<User.RegisterProps>(["username", "password", "bpassword", "mobilephone", "sms"]),
  Forget: new UserFrom<User.ForgetProps>(["mobilephone", "password", "bpassword", "sms"])
};