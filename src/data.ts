const info = {
    lang: 'zh-CN',
    nickName: '旅禾Tristan',
    email: 'i@qqzhi.cc',
    loc: 'Maoming,Guangdong,China'
}


let date = new Date(new Date().toLocaleString([], { timeZone: "Asia/Shanghai" }));
let [shortTime,timezone] = date.toLocaleString('en', { hour12: false, hour: "2-digit", minute: "2-digit", timeZoneName: "longOffset" }).replace("GMT","UTC").split(' ');
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