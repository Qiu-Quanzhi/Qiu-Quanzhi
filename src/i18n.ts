import { createI18n } from 'vue-i18n'
import langs from '@/languages/index'

let locale=location.pathname.toLowerCase().replace("/","").replace(".html","").replace("index","")||localStorage.getItem('lang')||navigator.language.toLowerCase()
let lang: string = locale
if (locale.startsWith("zh")){
    lang = "zh-cn"
    if (locale == "zh-hk" || locale == "zh-mo" || locale == "zh-tw")
        lang = "zh-hk"
}
else
    lang="en"

const i18n=createI18n({
    fallbackLocale: 'en',
    globalInjection: true,
    locale: lang,
    messages: langs
})

export default i18n