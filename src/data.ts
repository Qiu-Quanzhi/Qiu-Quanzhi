const info = {
    lang: 'zh-CN',
    nickName: '旅禾Ryoine',
    email: 'i@qqzhi.cc',
    birthday: 'Lunar 02-02 (2008-03-09)',
    loc: 'Maoming, Guangdong, China',
    GPGFingerprint: '9A9D 4561 98CE 0D31 552F<br>9B3D 0398 A1CB FE77 BB60',
    GPGUrl: 'https://github.com/Qiu-Quanzhi.gpg',
    timeZone: "Asia/Shanghai",
    socialMedias: [
        { id: "mail", url: "mailto:i@qqzhi.cc", info: "i@qqzhi.cc" },
        { id: "Weixin", url: "/assets/qrcodes/WX.png", mode: "embed", info: "Qiu-Qz" },
        { id: "QQ", url: "/assets/qrcodes/QQ.png", mode: "embed", info: "2766468782" },
        { id: "blog", url: "https://home.qqzhi.cc" },
        { id: "Github", url: "https://github.com/Qiu-Quanzhi" },
        { id: "Bilibili",url: "https://space.bilibili.com/1036651852" },
        { id: "LinkedIn", url: "https://www.linkedin.com/in/qqz/" }
    ],
    contact: {
        QQ: "2766468782",
        Weixin: "Qiu-Qz",
        mail: "i@qqzhi.cc"
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

// --- Work links: paired with locale content (parts.work.contents) by index ---
const workLinkData = [
  { href: 'https://home.qqzhi.cc/',                             id: 'workLink_Blog',     embed: false },
  { href: 'https://www.qqzhi.cc/works/HistoryMap/',             id: 'workLink_History',  embed: false },
  { href: 'https://space.bilibili.com/1036651852/',              id: 'workLink_Bilibili', embed: false },
  { href: 'https://mp.weixin.qq.com/mp/homepage?__biz=Mzg3MDY2MzM3MA==&hid=1&sn=c08c5cacb8a243ed154c5696e9f69951', id: 'workLink_Article', embed: true },
]

// --- Log entries: each maps a date to a descriptive key in parts.log.contents ---
type LogEntry = {
  kind: 'entry'
  date: string
  contentKey: string
  highlight?: { prefix: string; text: string; suffix: string }
} | {
  kind: 'continuation'
  contentKeys: string[]
}

const logEntries: LogEntry[] = [
  { kind: 'entry', date: '2022.8.16', contentKey: 'domainCreated', highlight: { prefix: '「', text: 'QQzhi.cc', suffix: '」' } },
  { kind: 'entry', date: '2022.8.17', contentKey: 'httpsEnabled' },
  { kind: 'entry', date: '2023.7.18', contentKey: 'siteRedesigned' },
  { kind: 'entry', date: '2023.7.19', contentKey: 'multiLanguage' },
  { kind: 'continuation', contentKeys: ['toBeContinued_0', 'toBeContinued_1'] },
]

// --- Footer link data: columns 0–2 (col 3 is copyright, rendered statically) ---
const footerLinkData = [
  {
    links: [{ href: 'https://home.qqzhi.cc/links/', type: 'link' as const }],
  },
  {
    links: [
      { contact: 'QQ' as keyof typeof info.contact, type: 'contact' as const },
      { contact: 'Weixin' as keyof typeof info.contact, type: 'contact' as const },
      { contact: 'mail' as keyof typeof info.contact, type: 'contact' as const },
    ],
  },
  {
    links: [
      { href: 'https://space.bilibili.com/1036651852', type: 'link' as const },
      { href: 'https://www.zhihu.com/people/Ryoine', type: 'link' as const },
      { href: 'https://afdian.com/a/Ryoine', type: 'link' as const },
    ],
  },
]

export {
    info,
    time,
    workLinkData,
    logEntries,
    footerLinkData,
}
export type { LogEntry }
