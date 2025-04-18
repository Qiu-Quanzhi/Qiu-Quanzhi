import { title } from "process";

export default {
    lang: 'zh-CN',
    title: '旅禾Ryoine - 邱泉智',
    href: '/zh-cn',
    name: '邱泉智',
    nameHTML: '邱泉智',
    tags: ['00后','知识','技术','学生'],
    slogan: '永不熄灭的理想之焰，足可抵挡凛冬的风霜刀剑',
    parts:{
        about:{
            title:'关于我',
            contents:[
                '本人是一名技术学习者、理论实践者，',
                '在读于信宜市信宜中学，',
                '热衷于探讨各类学术话题，',
                '欢迎一起学习，共同进步！',
                '联系邮箱: '
            ]
        },
        work:{
            title:'项目作品',
            contents:[
                {
                    title: '旅禾小栈',
                    intro: '分享学识，分装快乐',
                    cat: '个人博客'
                },{
                    title: '古国简展',
                    intro: '初中古早作品，历史类信息项目',
                    cat: '网页应用'
                },{
                    title: '小电视频道',
                    intro: '在线观看视频作品',
                    cat: '哔哩哔哩'
                },{
                    title: '公众号频道',
                    intro: '浏览订阅文章作品',
                    cat: '微信公众号'
                },
            ]
        },
        show: {
            title: '作品简展',
            tip: '下面仅提供简中内容'
        },
        log: {
            title: '小栈事记',
            tip: '左右滑动来查看',
            contents: [
                "未完",
                "待续……",
                "启用域名",
                "全站HTTPS",
                "网站改版",
                "支持多语言"
            ],
        }
    },
    footer:[{
        title:'友情链接',
        contents: ["友链与鸣谢-旅禾小栈"]
    },{
        title:'与我联系',
        contents: ["联系-QQ","联系-微信","联系-邮箱"]
    },{
        title:'更多内容',
        contents: ["主页-原创馆","主页-洛谷","主页-爱发电"]
    }],
    texts:{
        background: '背景',
        copy: {
            success: '已复制 {title} 到剪贴板',
            fail: '无法复制 {title}'
        },
        copied: '已尝试复制',
        id: '号码',
        address: '地址',
        clickToLoad: '点击加载'
    },
    aria: {
        avatar: '头像',
        Bilibili: '哔哩哔哩',
        Netease: '网易云音乐',
        LinkedIn: '领英',
        Weixin: '微信',
        QQ: 'QQ',
        mail: '电子邮箱',
        Github: 'Github',
        X: 'X',
        blog: '博客',
        goto: '转到 ',
        footer: '页脚',
        scrolldown: '下一页'
    },
    info: {
        Weixin: '微信号',
        QQ: 'QQ号',
        mail: '电子邮箱地址',
    }
}
