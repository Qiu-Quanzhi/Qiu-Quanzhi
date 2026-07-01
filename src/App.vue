<script setup lang="ts">
import { info, time, workLinkData, logEntries, footerLinkData } from '@/data'

import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t, tm, locale } = useI18n();

import show from '@/components/show.vue';
import cardInfo from '@/components/cardInfo.vue';

const loaded = ref(false)
const activated = ref(false)

type socialMedia = { id: string, url: string, mode?: string, info?: string }
const socialMediaList = ref<Array<socialMedia>>(info.socialMedias)
const openLink = (target: MouseEvent | HTMLAnchorElement) => {
  let url: string
  if (target instanceof MouseEvent) {
    target.preventDefault()
    url = (target.currentTarget as HTMLAnchorElement).href
  }else
    url = target.href
  window.open(url, '', 'height=615,width=450,scrollbars=yes,status=yes')
}
const copyInfo = (item: socialMedia ,event: MouseEvent) => {
  if (item.info === undefined) return
  event.preventDefault()
  let target = event.currentTarget as HTMLAnchorElement
  navigator.clipboard.writeText(item.info)
    .then(() => {
      alert(t('texts.copy.success',{title:t(`info.${item.id}`)}));
    })
    .catch(() => {
      alert(t('texts.copy.fail',{title:t(`info.${item.id}`)}));
    }).finally(() => {
      if (item.mode === 'embed')
        openLink(target)
      else
        window.open(item.url, '_blank')
    });
}
const copyContact = (id: keyof typeof info.contact) => {
  navigator.clipboard.writeText(info.contact[id])
    .then(() => {
      alert(t('texts.copy.success',{title:t(`info.${id}`)}));
    })
    .catch(() => {
      alert(t('texts.copy.fail',{title:t(`info.${id}`)}));
    })
}
const handleScroll = () => {
  if (window.scrollY > 0) {
    activated.value = true;
  }
};

const changeLang = (lang: string,event?: MouseEvent) => {
  locale.value = lang
  if (event){
    event.preventDefault()
    localStorage.setItem('lang', t('href').replace(/^\//, ''))
  }
  document.documentElement.lang = t('lang')
  document.title = t('title')
  history.replaceState(null, '', t('href'))
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', location.href)
}
onMounted(async () => {
  location.pathname !== t('href') && changeLang(t('href').replace(/^\//, ''))
  setTimeout(() => {
    loaded.value = true
  }, 500);
  window.addEventListener('scroll', handleScroll);
})

const langOptions = [
  { code: 'zh-cn', href: '/zh-cn', aria: '切换至简体中文', hreflang: 'zh-cn', lang: 'zh-cn', label: '简', displayLocale: 'zh-CN' },
  { code: 'zh-hk', href: '/zh-hk', aria: '切換至繁體中文', hreflang: 'zh-hk', lang: 'zh-hk', label: '繁', displayLocale: 'zh-HK' },
  { code: 'en', href: '/en', aria: 'Switch to English', hreflang: 'en', lang: 'en', label: 'EN', displayLocale: 'en' },
]

const navAnchors = [
  { href: '#info', labelKey: 'parts.about.title' },
  { href: '#work', labelKey: 'parts.work.title' },
  { href: '#log', labelKey: 'parts.log.title' },
  { href: '#footer', labelKey: 'aria.footer' },
]

const tagList = computed(() => tm('tags') as unknown as string[])
const aboutContents = computed(() => tm('parts.about.contents') as unknown as string[])
const workContents = computed(() => tm('parts.work.contents') as unknown as Array<{ title: string, intro: string, cat: string }>)

const handleWorkClick = (index: number, event: MouseEvent) => {
  if (workLinkData[index]?.embed) openLink(event)
}
</script>

<template>
  <div class="flex-col item-center" style="width: 100%;" :lang="t('lang')">
    <div class="lang-area" data-nosnippet>
      <template v-for="(opt, index) in langOptions" :key="opt.code">
        <i v-if="Number(index) > 0" class="s-line" aria-hidden="true">|</i>
        <a :href="opt.href" :aria-label="opt.aria" @click="changeLang(opt.code, $event)" :class="[t('lang') == opt.displayLocale ? 'current' : '']" :hreflang="opt.hreflang" :lang="opt.lang">{{ opt.label }}</a>
      </template>
    </div>
    <a v-for="anchor in navAnchors" :key="anchor.href" :aria-label="t('aria.goto') + t(anchor.labelKey)" :href="anchor.href"></a>
    <div id="home" class="flex-col item-center content-center">
      <div class="info">
        <div :class="['card', 'blanked', loaded ? 'loaded' : '']">
          <div class="flex-row item-center">
            <img aria-hidden="true" class="info-logo" src="/assets/logo.webp">
            <div class="flex-col">
              <div class="flex-row item-center">
                <h2>
                  <ruby style="ruby-position: under;">
                    <ruby style="ruby-position: over;">
                      {{ t('name.full') }}
                      <rp>(</rp><rt>{{ t("name.pinyin") }}</rt><rp>)</rp>
                    </ruby>
                    <rt lang="zh-cn">({{ info.nickName }})</rt>
                  </ruby>
                </h2>
                <div class="tag-box">
                  <span v-for="(tag, index) in tagList" :key="index">{{ tag }}</span>
                </div>
              </div>
              <span>{{ t('slogan') }}</span>
            </div>
          </div>
          <div class="flex-row content-evenly media-box">
            <a v-for="item in socialMediaList" target="_blank" @click="copyInfo(item,$event)" :href="item.url">
              <img :title="t(`aria.${item.id}`)" :alt="t(`aria.${item.id}`)" height="25" width="25"
                :src="`assets/icons/${item.id}.svg`"></a>
          </div>
        </div>
      </div>
    </div>
    <a :title="t('aria.scrolldown')" href="#info" class="flex-row item-center"
      style="position: absolute;width: 100%;bottom: 150px;height: 20px;">
      <span :class="['scroll-down', loaded ? 'loaded' : '']"></span>
    </a>
    <div :class="['bg', 'blanked', loaded ? 'loaded' : '']"></div>
    <div id="info" class="flex-col item-center block">
      <h3>{{ t('parts.about.title') }}</h3>
      <span class="underline1"></span>
      <div class="info-content flex-row item-center">
        <div class="flex-col item-center">
          <p v-for="(content, index) in aboutContents" :key="index">
            {{ content }}<a v-if="index === aboutContents.length - 1" :href="`mailto:${info.email}`" class="highlight link">{{ info.email }}</a>
          </p>
        </div>
        <cardInfo :info="info" :time="time" :loaded="loaded"></cardInfo>
      </div>
    </div>
    <div data-nosnippet id="work" class="flex-col item-center block">
      <h3>{{ t('parts.work.title') }}</h3>
      <span class="underline1"></span>
      <div class="work-list">
        <a v-for="(work, index) in workContents" :key="index"
           :href="workLinkData[index]?.href" target="_blank" class="work-link"
           :id="workLinkData[index]?.id"
           @click="handleWorkClick(index, $event)">
          <img loading="lazy" class="work-link-pic" :src="workLinkData[index]?.pic" alt="" />
          <div class="work-link-text">
            <p class="work-link-title">{{ work.title }}</p>
            <p class="work-link-intro">{{ work.intro }}</p>
            <p class="work-link-cat">{{ work.cat }}</p>
          </div>
        </a>
      </div>
    </div>
    <div data-nosnippet id="show" class="flex-col item-center block">
      <h3>{{ t('parts.show.title') }}</h3>
      <span class="underline1"></span>
      <p class="tip">{{ t('parts.show.tip') }}</p>
      <show v-if="activated"></show>
      <span v-else class="pointer" @click="() => { activated = true }">{{ t('texts.clickToLoad') }}</span>
    </div>
    <div data-nosnippet id="log" class="flex-col item-center block">
      <h3>{{ t('parts.log.title') }}</h3><span class="underline1"></span>
      <p class="tip">{{ t('parts.log.tip') }}</p>
      <div class="log-box-outer">
        <div class="log-box">
          <div v-for="(entry, index) in logEntries" :key="index">
            <template v-if="entry.kind === 'entry'">
              <p class="log-text-1">{{ entry.date }}</p>
              <p class="log-text-2">
                {{ t(`parts.log.contents.${entry.contentKey}`) }}<template v-if="entry.highlight">{{ entry.highlight.prefix }}<span class="highlight">{{ entry.highlight.text }}</span>{{ entry.highlight.suffix }}</template>
              </p>
            </template>
            <template v-else>
              <p class="log-text-3">{{ t(`parts.log.contents.${entry.contentKeys[0]}`) }}</p>
              <p class="log-text-3">{{ t(`parts.log.contents.${entry.contentKeys[1]}`) }}</p>
            </template>
          </div>
        </div>
      </div>
    </div>
    <footer data-nosnippet id="footer">
      <div v-for="(col, colIdx) in footerLinkData" :key="colIdx">
        <p>{{ t(`footer[${colIdx}].title`) }}</p>
        <template v-for="(link, linkIdx) in col.links" :key="linkIdx">
          <a v-if="link.type === 'link'" :href="link.href" target="_blank">{{ t(`footer[${colIdx}].contents[${linkIdx}]`) }}</a>
          <a v-else href="" @click="copyContact(link.contact)" target="_blank">{{ t(`footer[${colIdx}].contents[${linkIdx}]`) }}</a>
          <br>
        </template>
      </div>
      <div>
        <p>© {{ time.year }} {{ t('name.full') }}</p>
        <span>{{ t('texts.background') }}: Frozen in Time - Lunanella</span><br>
        <a target="__blank" href="https://beian.miit.gov.cn/">粤ICP备XXXXXXXXXX号-X</a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.lang-area {
  z-index: 100;
  -webkit-user-select: none;
  user-select: none;
  display: block;
  position: absolute;
  right: 25px;
  top: 25px
}

.lang-area a.current {
  opacity: 1;
  transform: scale(1.1);
  cursor: default
}

.lang-area a:hover {
  transform: scale(1.1)
}

.lang-area a {
  display: inline-block;
  font-size: 16px;
  color: #fff;
  opacity: .7;
  cursor: pointer
}

.lang-area .s-line {
  display: inline-block;
  font-size: 12px;
  margin: 0 5px;
  position: relative;
  top: -2px;
  color: var(--w-alpha-90);
  opacity: .7
}

#home {
  width: 100%;
  height: 100vh
}

.block {
  animation: 0.6s ease 1s 1 normal backwards running slide-in;
  transition: transform .25s, backdrop-filter .25s, background-color .25s;
}

#info {
  margin-top: -40px
}

.block {
  background-color: var(--w-alpha-80);
  -webkit-backdrop-filter: var(--filter-glass-1);
  backdrop-filter: var(--filter-glass-1);
  width: calc(100% - 40px);
  padding: 20px .5em 50px;
  text-align: center;
  transition: .25s;
  border-radius: 10px
}

.block+.block {
  margin-top: 50px
}

.block:hover {
  background-color: var(--w-alpha-80);
  transform: scale(1.01);
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
}

.block h3 {
  font-weight: 400;
  font-size: 30px;
  color: var(--txt-b-pure);
  transition: .25s;
  margin-block-end: 0
}

.block>p, .block#info p {
  font-size: 14px;
  margin-block-start: 0
}

.info {
  position: absolute;
  right: calc((100% - 200px)*.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info>div {
  margin: 7.5px;
}

.info h2 {
  margin-block-start: 0;
  margin-block-end: 0;
  white-space: nowrap;
}

.info-logo {
  width: 60px;
  height: 60px;
  margin-right: 10px
}

.media-box {
  width: 100%;
  margin-top: 15px;
  height: 25px;
}

.media-box>a {
  width: 25px;
  height: 25px;
}

.tag-box {
  -webkit-user-select: none;
  user-select: none;
  display: flex;
  font-size: small;
  font-weight: 600
}

.tag-box>span {
  margin: 3px;
  padding: 4px 9px;
  border-radius: 5px;
  background-color: var(--b-alpha-5);
  color: var(--b-alpha-40);
  transition: .25s;
  white-space: nowrap;
}

.tag-box>span:hover {
  background-color: var(--b-alpha-10);
  color: var(--txt-b);
  -webkit-box-shadow: rgba(0, 0, 0, .1) 0 5px 10px;
  -moz-box-shadow: rgba(0, 0, 0, .1) 0 5px 10px;
  box-shadow: #0000001a 0 5px 10px
}

.media-box img {
  opacity: .8;
  transition: .2s;
  cursor: pointer;
  transform: scale(1)
}

.media-box img:hover {
  opacity: 1;
  transform: scale(1.05);
  border-color: var(--theme-color);
  margin: -5px 0 -7px;
  border-style: solid;
  border-width: 0;
  border-bottom-width: 2px;
  padding: 5px 0
}

.tip {
  margin-top: -20px;
  font-size: 12px;
  color: var(--b-alpha-60)
}

.log-box-outer {
  margin-top: 10px;
  margin-bottom: 30px;
  width: 70%;
  overflow: hidden
}

.log-box-outer * {
  transition: .25s
}

.log-box {
  white-space: nowrap;
  overflow-y: hidden;
  overflow-x: auto
}

.log-box::-webkit-scrollbar {
  height: 5px
}

.log-box div {
  display: inline-block;
  padding: 0 30px;
  text-align: left;
  vertical-align: top
}

.log-text-1,
.log-text-3 {
  font-size: 18px;
  line-height: 3px;
  font-weight: 500
}

.log-text-1 {
  color: var(--txt-b-pure)
}

.log-text-2 {
  color: var(--b-alpha-80);
  font-size: small;
  line-height: 5px
}

.log-text-3 {
  color: var(--b-alpha-60)
}

footer {
  margin: 50px;
  padding: 20px 20px 30px;
  border-radius: 10px
}

footer:hover {
  transition: backdrop-filter .1s;
  background-color: var(--b-alpha-30-fixed);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  backdrop-filter: blur(30px) saturate(180%)
}

footer div {
  display: inline-block;
  position: relative;
  text-align: left;
  vertical-align: top;
  padding: 0 50px;
  margin-top: 10px
}

footer p {
  font-family: Microsoft Yahei, PingFangSC-Regular;
  font-size: 15px;
  font-weight: 700;
  line-height: 10px;
  white-space: nowrap;
  color: #fff
}

footer a,
footer span {
  position: relative;
  border-bottom: 1px solid transparent;
  color: #fff;
  font-size: 12px;
  line-height: 30px
}

footer a:hover {
  border-color: var(--theme-color);
  color: var(--theme-color)
}

footer a:active {
  border-color: var(--theme-color-active);
  color: var(--theme-color-active)
}

#copyright p {
  font-family: Microsoft Yahei Light;
  font-size: 12px;
  font-weight: initial
}

div ::-webkit-scrollbar {
  width: 5px
}

div ::-webkit-scrollbar-thumb {
  background-color: var(--b-alpha-10);
  border-radius: 3px
}

div ::-webkit-scrollbar-thumb:hover {
  background-color: var(--b-alpha-20)
}

div ::-webkit-scrollbar-thumb:active {
  background-color: var(--theme-color)
}

@media screen and (max-width: 660px) {
  .lang-area a {
    font-size: 20px !important;
  }

  .lang-area i {
    font-size: 16px !important;
  }

  footer {
    line-height: 2em;
  }

  footer a {
    font-size: 15px !important;
  }
}

@media (max-width: 800px) {

  .info-content{
    flex-direction: column;
  }

  .info {
    position: static
  }

  .info {
    transform: scale(.9)
  }

  .info h2 {
    transform: scale(0.9)
  }

  .tag-box {
    font-size: .5em
  }

  .info-logo {
    width: 50px;
    height: 50px;
    margin-right: 5px
  }

  .media-box {
    transform: scale(.9)
  }

  .scroll-down {
        display: none;
    }
}
</style>