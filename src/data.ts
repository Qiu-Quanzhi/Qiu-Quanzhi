const info = {
    lang: 'zh-CN',
    nickName: '旅禾Ryoine',
    email: 'i@qqzhi.cc',
    birthday: '03-09 / Chinese Lunar 02-02',
    loc: 'Maoming, Guangdong, China',
    GPGFingerprint: '9A9D 4561 98CE 0D31 552F<br>9B3D 0398 A1CB FE77 BB60',
    GPGUrl: 'https://github.com/Qiu-Quanzhi.gpg',
    timeZone: "Asia/Shanghai",
    socialMedias: [
        { id: "mail", url: "mailto:i@qqzhi.cc", info: "i@qqzhi.cc" },
        { id: "Weixin", url: "/WX.png", mode: "embed", info: "Qiu-Qz" },
        { id: "QQ", url: "/QQ.png", mode: "embed", info: "2766468782" },
        { id: "blog", url: "https://home.qqzhi.cc" },
        { id: "Github", url: "https://github.com/Qiu-Quanzhi" },
        { id: "Bilibili",url: "https://space.bilibili.com/1036651852" },
        { id: "LinkedIn", url: "https://www.linkedin.com/in/qqz/" }
    ],
    contact: {
        QQ: "2766468782",
        Weixin: "Qiu-Qz"
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
