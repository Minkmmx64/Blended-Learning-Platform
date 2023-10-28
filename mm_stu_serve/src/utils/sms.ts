import * as sms from "svg-captcha";

export const svgCode = (config?: sms.ConfigObject) => {
    const defaultConfig = {
        noise: 5,
        size: 5,
        color: true,
        background: "#fff",
    } as sms.ConfigObject
    config = config ?? {};
    return sms.create(Object.assign(defaultConfig, config));
}