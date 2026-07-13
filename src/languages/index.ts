const messages: Record<string, any> = {
  'zh-cn': () => import('./locales/zh-CN'),
  'zh-hk': () => import('./locales/zh-HK'),
  'en':    () => import('./locales/en'),
}
export default messages
