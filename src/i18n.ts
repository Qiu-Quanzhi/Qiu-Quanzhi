import { createI18n } from 'vue-i18n'
import langs from './languages/index'
let locale=location.pathname.replace("/","").toLowerCase()||'zh-cn'

const i18n=createI18n({
    fallbackLocale: 'zh',
    globalInjection: true,
    locale: locale,
    messages: langs,
    legacy: false
})

export default i18n