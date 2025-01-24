const info = {
    lang: 'zh-CN',
    nickName: '旅禾Tristan',
    email: 'i@qqzhi.cc',
    loc: 'Maoming, Guangdong, China',
    GPGFingerprint: '9A9D 4561 98CE 0D31 552F<br>9B3D 0398 A1CB FE77 BB60',
    GPGUrl: 'https://github.com/Qiu-Quanzhi.gpg',
    timeZone: "Asia/Shanghai",
    socialMedias: [
        { id: "mail", url: "mailto:i@qqzhi.cc" },
        { id: "Github", url: "https://github.com/Qiu-Quanzhi" },
        { id: "LinkedIn", url: "https://www.linkedin.com/in/qqz/" },
        { id: "Bilibili",url: "https://space.bilibili.com/1036651852" },
        { id: "X", url: "https://x.com/RyoineQ" },
        { id: "Luogu", url: "https://www.luogu.com.cn/user/525682" },
        { id: "Weixin", url: "https://mp.weixin.qq.com/mp/homepage?__biz=Mzg3MDY2MzM3MA==&hid=1&sn=c08c5cacb8a243ed154c5696e9f69951", mode: "embed" }
    ],
    contact: {
        QQ: "2424742162",
        Weixin: "RyoineQ"
    }
}


let date = new Date(new Date().toLocaleString([], { timeZone: info.timeZone }));
let [shortTime, timezone] = date.toLocaleString('en', { hour12: false, hour: "2-digit", minute: "2-digit", timeZoneName: "longOffset" }).replace("GMT", "UTC").split(' ');
let year = date.getFullYear();
const time = {
    shortTime,
    timezone,
    year,
    date
}

export {
    info,
    time
}
