<script setup lang="ts">
import { info, time } from '@/data'

import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();

import show from 'components/show.vue';
import cardInfo from 'components/cardInfo.vue';

const loaded = ref(false)
const activated = ref(false)

type socialMedia = { id: string, url: string, mode: string | undefined, info: string | undefined }
const socialMediaList = ref<Array<socialMedia>>(info.socialMedias)
/*
fetch('/assets/data/socialMedias.json')
  .then((response) => response.json())
  .then((json: Array<socialMedia>) => {
    socialMediaList.value = json
  }).catch((error) => {
    console.error('[获取社交媒体列表错误/Error on fetching social media list]', error);
  });
*/
const contactContent = ref([t('footer[1].contents[0]'), t('footer[1].contents[1]'), t('footer[1].contents[2]')])
const contactList = [info.contact.QQ, info.contact.Weixin, info.email]
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
const copyContact = (idx: number) => {
  navigator.clipboard.writeText(contactList[idx])
  contactContent.value[idx] = t(`footer[1].contents[${idx}]`) + ' (' + t('texts.copied') + ')'
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
    localStorage.setItem('lang', t('href').replace('/',''))
  }
  document.documentElement.lang = t('lang')
  document.title = t('title')
  history.replaceState(null, '', t('href'))
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', location.href)
}
onMounted(async () => {
  location.pathname !== t('href') && changeLang(t('href').replace('/',''))
  setTimeout(() => {
    loaded.value = true
  }, 500);
  window.addEventListener('scroll', handleScroll);
})
</script>

<template>
  <view class="flex-col item-center" style="width: 100%;" :lang="t('lang')">
    <div class="lang-area" data-nosnippet>
      <a href="/zh-cn" aria-label="切换至简体中文" @click="changeLang('zh-cn',$event)" :class="[t('lang') == 'zh-CN' ? 'current' : '']" hreflang="zh-cn" lang="zh-cn">简</a>
      <i class="s_line" aria-hidden="true">|</i>
      <a href="/zh-hk" aria-label="切換至繁體中文" @click="changeLang('zh-hk',$event)" :class="[t('lang') == 'zh-HK' ? 'current' : '']" hreflang="zh-hk" lang="zh-hk">繁</a>
      <i class="s_line" aria-hidden="true">|</i>
      <a href="/en" aria-label="Switch to English" @click="changeLang('en',$event)" :class="[t('lang') == 'en' ? 'current' : '']" hreflang="en" lang="en">EN</a>
    </div>
    <a :aria-label="t('aria.goto') + t('parts.about.title')" href="#about"></a>
    <a :aria-label="t('aria.goto') + t('parts.work.title')" href="#work"></a>
    <a :aria-label="t('aria.goto') + t('parts.log.title')" href="#log"></a>
    <a :aria-label="t('aria.goto') + t('aria.footer')" href="#footer"></a>
    <view id="home" class="flex-col item-center content-center">
      <view class="info">
        <view :class="['card', 'blanked', loaded ? 'loaded' : '']">
          <view class="flex-row item-center">
            <img aria-hidden="true" class="info-logo" src="/assets/logo.webp">
            <view class="flex-col">
              <view class="flex-row item-center">
                <h2>
                  <ruby style="ruby-position: under;">
                    <ruby style="ruby-position: over;" v-html="t('nameHTML')">
                    </ruby>
                    <rt lang="zh-cn">({{ info.nickName }})</rt>
                  </ruby>
                </h2>
                <view class="tag-box">
                  <span>{{ t('tags[0]') }}</span>
                  <span>{{ t('tags[1]') }}</span>
                  <span>{{ t('tags[2]') }}</span>
                  <span>{{ t('tags[3]') }}</span>
                </view>
              </view>
              <span>{{ t('slogan') }}</span>
            </view>
          </view>
          <view class="flex-row content-evenly media-box">
            <a v-for="item in socialMediaList" target="_blank" @click="copyInfo(item,$event)" :href="item.url">
              <img :title="t(`aria.${item.id}`)" :alt="t(`aria.${item.id}`)" height="25" width="25"
                :src="`assets/icons/${item.id}.svg`"></a>
          </view>
        </view>
      </view>
    </view>
    <a :title="t('aria.scrolldown')" href="#info" class="flex-row item-center"
      style="position: absolute;width: 100%;bottom: 150px;height: 20px;">
      <span :class="['scroll-down', loaded ? 'loaded' : '']"></span>
    </a>
    <view :class="['bg', 'blanked', loaded ? 'loaded' : '']"></view>
    <view id="info" class="flex-col item-center block">
      <h3>{{ t('parts.about.title') }}</h3>
      <span class="underline1"></span>
      <div class="info-content flex-row item-center">
        <div class="flex-col item-center">
          <p>{{ t('parts.about.contents[0]') }}</p>
          <p>{{ t('parts.about.contents[1]') }}</p>
          <p>{{ t('parts.about.contents[2]') }}</p>
          <p>{{ t('parts.about.contents[3]') }}</p>
          <p>{{ t('parts.about.contents[4]') }}<a :href="`mailto:${info.email}`" class="highlight link">{{ info.email }}</a></p>
        </div>
        <cardInfo :info="info" :time="time" :loaded="loaded"></cardInfo>
      </div>
    </view>
    <view data-nosnippet id="work" class="flex-col item-center block">
      <h3>{{ t('parts.work.title') }}</h3>
      <span class="underline1"></span>
      <div class="workList"><a href="https://home.qqzhi.cc/" target="_blank" class="workLink" id="workLink_Blog">
          <div class="workLinkPic"></div>
          <div class="workLinkText">
            <p class="workLinkTitle">{{ t('parts.work.contents[0].title') }}</p>
            <p class="workLinkIntro">{{ t('parts.work.contents[0].intro') }}</p>
            <p class="workLinkCat">{{ t('parts.work.contents[0].cat') }}</p>
          </div>
        </a><a href="https://www.qqzhi.cc/works/HistoryMap/" target="_blank" class="workLink" id="workLink_History">
          <div class="workLinkPic"></div>
          <div class="workLinkText">
            <p class="workLinkTitle">{{ t('parts.work.contents[1].title') }}</p>
            <p class="workLinkIntro">{{ t('parts.work.contents[1].intro') }}</p>
            <p class="workLinkCat">{{ t('parts.work.contents[1].cat') }}</p>
          </div>
        </a><a href="https://space.bilibili.com/1036651852/" target="_blank" class="workLink" id="workLink_Bilibili">
          <div class="workLinkPic"></div>
          <div class="workLinkText">
            <p class="workLinkTitle">{{ t('parts.work.contents[2].title') }}</p>
            <p class="workLinkIntro">{{ t('parts.work.contents[2].intro') }}</p>
            <p class="workLinkCat">{{ t('parts.work.contents[2].cat') }}</p>
          </div>
        </a><a @click="openLink"
          href="https://mp.weixin.qq.com/mp/homepage?__biz=Mzg3MDY2MzM3MA==&hid=1&sn=c08c5cacb8a243ed154c5696e9f69951"
          target="_blank" class="workLink" id="workLink_Article">
          <div class="workLinkPic"></div>
          <div class="workLinkText">
            <p class="workLinkTitle">{{ t('parts.work.contents[3].title') }}</p>
            <p class="workLinkIntro">{{ t('parts.work.contents[3].intro') }}</p>
            <p class="workLinkCat">{{ t('parts.work.contents[3].cat') }}</p>
          </div>
        </a></div>
    </view>
    <view data-nosnippet id="show" class="flex-col item-center block">
      <h3>{{ t('parts.show.title') }}</h3>
      <span class="underline1"></span>
      <p class="tip" aria-hidden="true">{{ t('parts.show.tip') }}</p>
      <show v-if="activated"></show>
      <span v-else class="pointer" @click="() => { activated = true }">{{ t('texts.clickToLoad') }}</span>
    </view>
    <view data-nosnippet id="log" class="flex-col item-center block">
      <h3>{{ t('parts.log.title') }}</h3><span class="underline1"></span>
      <p class="tip" aria-hidden="true">{{ t('parts.log.tip') }}</p>
      <div class="logBoxOuter">
        <div id="logBox">
          <div>
            <p class="logText1">2022.8.16</p>
            <p class="logText2">{{ t('parts.log.contents[2]') }}「<span class="highlight">QQzhi.cc</span>」</p>
          </div>
          <div>
            <p class="logText1">2022.8.17</p>
            <p class="logText2">{{ t('parts.log.contents[3]') }}</p>
          </div>
          <div>
            <p class="logText1">2023.7.18</p>
            <p class="logText2">{{ t('parts.log.contents[4]') }}</p>
          </div>
          <div>
            <p class="logText1">2023.7.19</p>
            <p class="logText2">{{ t('parts.log.contents[5]') }}</p>
          </div>
          <div>
            <p class="logText3">{{ t('parts.log.contents[0]') }}</p>
            <p class="logText3">{{ t('parts.log.contents[1]') }}</p>
          </div>
        </div>
      </div>
    </view>
    <footer data-nosnippet id="footer">
      <div>
        <p>{{ t('footer[0].title') }}</p><a rel="nofollow" href="https://home.qqzhi.cc/links/" target="_blank">{{
          t('footer[0].contents[0]')
        }}</a>
      </div>
      <div>
        <p>{{ t('footer[1].title') }}</p>
        <a @click="copyContact(0)" id="QQ" target="_blank">{{ contactContent[0] }}</a><br>
        <a @click="copyContact(1)" id="Weixin" target="_blank">{{ contactContent[1] }}</a><br>
        <a @click="copyContact(2)" id="Mail" target="_blank">{{ contactContent[2] }}</a><br>
      </div>
      <div>
        <p>{{ t('footer[2].title') }}</p>
        <a href="https://ycg.qq.com/person/works/2673519" target="_blank">{{ t('footer[2].contents[0]') }}</a><br>
        <a href="https://www.luogu.com.cn/user/525682" target="_blank">{{ t('footer[2].contents[1]')
          }}</a><br>
        <a href="https://afdian.com/a/Ryoine" target="_blank">{{ t('footer[2].contents[2]') }}</a><br>
      </div>
      <div>
        <p>© {{ time.year }} {{ t('name') }}</p>
        <span>{{ t('texts.background') }}: Frozen in Time - Lunanella</span><br>
        <a target="__blank" href="https://icp.gov.moe/?keyword=20232486">萌ICP备20232486号</a>
      </div>
    </footer>
  </view>
</template>

<style scoped>
.selection-box {
  margin: 10px
}

.media-tip {
  margin-top: 5px;
  margin-left: 5px;
  z-index: 20;
  position: absolute;
  color: var(---w-alpha-90)
}

.viewer {
  border-radius: 10px;
  background-color: var(--w-alpha-90)
}

.blog.viewer {
  width: calc(100vw - 80px);
  height: 80vh
}

.netease.viewer {
  width: calc((100vw - 80px)/2);
  height: 40vh
}

.selection {
  margin: 5px;
  width: 50px;
  height: 50px;
  opacity: .7;
  cursor: pointer
}

.selection:hover {
  transform: scale(1.05)
}

.selection.selected {
  opacity: 1;
  transform: scale(1.05)
}

.selection-id {
  color: var(--txt-b);
  pointer-events: none;
  font-weight: 600;
  opacity: 0
}

.selection-id.selected {
  pointer-events: all;
  opacity: 1
}

text {
  color: var(--theme-color)
}

.show-box {
  width: calc(100vw - 80px)
}

@media screen and (max-width: 660px) {
  .show-box {
    flex-direction: column;
    align-items: center
  }

  .player {
    width: calc(100vw - 80px) !important;
    height: calc((100vw - 80px)*.5625) !important;
    border-bottom-left-radius: 0 !important;
    border-top-left-radius: 5px !important;
    border-top-right-radius: 5px
  }

  .list {
    width: calc(100vw - 90px) !important;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 5px !important;
    border-bottom-left-radius: 5px;
    padding: 15px 5px 5px !important;
    margin-top: -5px;
    left: 0 !important;
    max-height: 30vh;
    height: unset !important;
    max-width: none !important
  }

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
    font-size: 15px !important
  }
}

.player {
  width: calc((100vw - 80px)/2);
  height: calc((100vw - 80px)*.28125);
  z-index: 10;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  background: url(/assets/icons/Bilibili.svg) no-repeat center;
  background-size: 10%;
  background-color: var(--b-alpha-90)
}

.list {
  position: relative;
  background-color: var(--b-alpha-10);
  height: calc((100vw - 80px)*.28125 - 10px);
  padding: 5px;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  overflow-y: scroll;
  overflow-x: hidden;
  max-width: 30vw
}

.list-item {
  margin: 3px 10px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer
}

.list-item:hover {
  transform: scale(1.05)
}

.list-item.selected {
  background-color: var(--w-alpha-90)
}

.list-item>span {
  margin: 1px 0 0;
  color: var(--txt-b);
  font-size: medium;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block
}

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

.lang-area .s_line {
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

.info>view {
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

.logBoxOuter {
  margin-top: 10px;
  margin-bottom: 30px;
  width: 70%;
  overflow: hidden
}

.logBoxOuter * {
  transition: .25s
}

#logBox {
  white-space: nowrap;
  overflow-y: hidden;
  overflow-x: auto
}

#logBox::-webkit-scrollbar {
  height: 5px
}

#logBox div {
  display: inline-block;
  padding: 0 30px;
  text-align: left;
  vertical-align: top
}

.logText1,
.logText3 {
  font-size: 18px;
  line-height: 3px;
  font-weight: 500
}

.logText1 {
  color: var(--txt-b-pure)
}

.logText2 {
  color: var(--b-alpha-80);
  font-size: small;
  line-height: 5px
}

.logText3 {
  color: var(--b-alpha-60)
}

footer {
  margin: 50px;
  padding: 20px 20px 30px;
  border-radius: 10px
}

footer:hover {
  transition: backdrop-filter .1s;
  background-color: var(---b-alpha-30);
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
