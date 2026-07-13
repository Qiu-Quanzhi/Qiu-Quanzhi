import { createI18n } from 'vue-i18n'
import loaders from '@/languages/index'

function detectLang(): string {
  const locale = location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '').replace('.html', '').replace('index', '')
    || localStorage.getItem('lang')
    || navigator.language.toLowerCase()

  if (locale.startsWith('zh')) {
    if (locale === 'zh-hk' || locale === 'zh-mo' || locale === 'zh-tw')
      return 'zh-hk'
    return 'zh-cn'
  }
  return 'en'
}

const lang = detectLang()

// Load only the detected locale at initialization
const initialMsgs: Record<string, any> = {}
const loaded: Record<string, boolean> = {}
initialMsgs[lang] = (await loaders[lang]()).default
loaded[lang] = true

const i18n = createI18n({
  legacy: false,
  fallbackLocale: 'en',
  globalInjection: true,
  locale: lang,
  messages: initialMsgs,
})

/** Load a locale on demand. Call before switching locale. */
export async function loadLocale(locale: string) {
  if (loaded[locale]) return
  const mod = await loaders[locale]()
  i18n.global.setLocaleMessage(locale, mod.default)
  loaded[locale] = true
}

/** Silently prefetch the other locales so language switching is instant. */
export function prefetchOtherLocales() {
  const others = Object.keys(loaders).filter(l => !loaded[l])
  others.forEach(l => {
    loaders[l]().then((mod: { default: Record<string, any> }) => {
      i18n.global.setLocaleMessage(l, mod.default)
      loaded[l] = true
    })
  })
}

export default i18n
