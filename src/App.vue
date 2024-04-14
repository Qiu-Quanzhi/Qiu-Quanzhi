<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()

import show from './components/show.vue';

const loaded = ref(false)
const activated=ref(false)
onMounted(() => {
  setTimeout(() => {
    loaded.value = true
  }, 500);
})
let date = new Date(Date.now() + 28800000)
type socialMedia = { id: string, url: string, mode: string | undefined }
const socialMediaList = ref<Array<socialMedia>>([])
fetch('/assets/data/socialMedias.json')
  .then((response) => response.json())
  .then((json: Array<socialMedia>) => {
    socialMediaList.value = json
  })
  const openLink=(event:any)=>{
    console.log(event)
    if (event) {
      event.preventDefault()
      event.currentTarget.href&&window.open( event.currentTarget.href , '', 'height=615,width=450,scrollbars=yes,status =yes')
    }
  }
  addEventListener('scroll',()=>{
    if(scrollY>0)
    activated.value=true
  })
</script>

<template>
  <view class="flex-col item-center" style="width: 100%;" :lang="t('lang')">
    <div class="lang-area" data-nosnippet>
      <a href="/" aria-label="切换至简体中文" :class="[t('lang') == 'zh-CN' ? 'current' : '']"
        lang="zh-cn">简</a>
      <i class="s_line" aria-hidden="true">|</i>
      <a href="/zh-hk" aria-label="切換至繁體中文" :class="[t('lang') == 'zh-HK' ? 'current' : '']"
        lang="zh-hk">繁</a>
      <i class="s_line" aria-hidden="true">|</i>
      <a href="/en" aria-label="Switch to English" :class="[t('lang') == 'en' ? 'current' : '']"
        lang="en-us">EN</a>
    </div>
    <a :aria-label="t('aria.goto') + t('parts.about.title')" href="#about"></a>
    <a :aria-label="t('aria.goto') + t('parts.work.title')" href="#work"></a>
    <a :aria-label="t('aria.goto') + t('parts.log.title')" href="#log"></a>
    <a :aria-label="t('aria.goto') + t('aria.footer')" href="#footer"></a>

    <view id="home" class="flex-col item-center content-center">
      <view class="info">
        <view :class="[ 'card', 'blanked', loaded ? 'loaded' : '']">
          <view class="flex-row item-center">
            <img aria-hidden="true" class="info-logo" src="/assets/logo.webp" />
            <view class="flex-col">
              <view class="flex-row item-center">
                <h2>
                  <ruby style="ruby-position: under;">
                <ruby style="ruby-position: over;" v-html="t('nameHTML')">
                </ruby><rt lang="zh-cn">(旅禾Tristan)</rt></ruby>
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
            <a v-for="item in socialMediaList" target="_blank" @click=" item.mode && openLink($event) " :href="item.url">
            <img :title="t('aria.' + item.id)" :alt="t('aria.' + item.id)" height="25" width="25" :src="`assets/icons/${item.id}.svg`" /></a>
          </view>
        </view>
        <view data-nosnippet :class="['card', 'blanked', loaded ? 'loaded' : '', 'mini']">
          <span class="time-display"> {{ date.getUTCHours().toString().padStart(2, '0') }}:{{
    date.getUTCMinutes().toString().padStart(2,'0') }} <span class="time-timezone">(UTC +8:00)</span></span>
        </view>
      </view>
    </view>
    <a :title="t('aria.scrolldown')" href="#info" class="flex-row item-center"
      style="position: absolute;width: 100%;bottom: 150px;height: 20px;">
      <span class="scroll-down"></span>
    </a>
    <view :class="['bg', 'blanked', loaded ? 'loaded' : '']"></view>
    <view id="info" class="flex-col item-center block">
      <h3>{{ t('parts.about.title') }}</h3>
      <span class="underline1"></span>
      <p>{{ t('parts.about.contents[0]') }}</p>
      <p>{{ t('parts.about.contents[1]') }}</p>
      <p>{{ t('parts.about.contents[2]') }}</p>
      <p>{{ t('parts.about.contents[3]') }}</p>
      <p>{{ t('parts.about.contents[4]') }}<a href="mailto:i@qqzhi.cc" class="highlight link">i@qqzhi.cc</a></p>
    </view>
    <view data-nosnippet id="work" class="flex-col item-center block">
      <h3>{{ t('parts.work.title') }}</h3>
      <span class="underline1"></span>
      <div class="workList"><a href="https://blog.qqzhi.cc/" target="_blank" class="workLink" id="workLink_Blog">
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
        </a><a @click="openLink" href="https://mp.weixin.qq.com/mp/homepage?__biz=Mzg3MDY2MzM3MA==&hid=1&sn=c08c5cacb8a243ed154c5696e9f69951" target="_blank" class="workLink" id="workLink_Article">
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
      <span v-else class="pointer" @click="()=>{activated=true}">{{t('texts.clickToLoad')}}</span>
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
        <p>{{ t('footer[0].title') }}</p><a rel="nofollow" href="http://xyzxoj.work/" target="_blank">{{ t('footer[0].contents[0]')
          }}</a>
      </div>
      <div>
        <p>{{ t('footer[1].title') }}</p>
        <a :onclick="'navigator.clipboard.writeText(\'2766468782\');document.querySelector(\'#QQ\').innerText=\'' + t('footer[1].contents[0]') + ' (' + t('texts.copied') + ')\''"
          id="QQ" target="_blank">{{ t('footer[1].contents[0]') }}</a><br>
        <a :onclick="'navigator.clipboard.writeText(\'Qiu-Quanzhi\');document.querySelector(\'#Weixin\').innerText=\'' + t('footer[1].contents[1]') + ' (' + t('texts.copied') + ')\''"
          id="Weixin" target="_blank">{{ t('footer[1].contents[1]') }}</a><br>
        <a :onclick="'navigator.clipboard.writeText(\'i@qqzhi.cc\');document.querySelector(\'#Mail\').innerText=\'' + t('footer[1].contents[2]') + ' (' + t('texts.copied') + ')\''"
          id="Mail" target="_blank">{{ t('footer[1].contents[2]') }}</a><br>
      </div>
      <div>
        <p>{{ t('footer[2].title') }}</p>
        <a href="https://ycg.qq.com/person/works/2673519" target="_blank">{{ t('footer[2].contents[0]') }}</a><br>
        <a href="https://www.zhihu.com/people/qian-xia-sheng-xin" target="_blank">{{ t('footer[2].contents[1]')
          }}</a><br>
        <a href="https://y.qq.com/n/ryqq/singer/0029evxu40hcqi" target="_blank">{{ t('footer[2].contents[2]') }}</a><br>
      </div>
      <div id="copyright">
        <p>© {{ date.getUTCFullYear() }} {{ t('name') }}</p>
        <p>{{ t('texts.background') }}: Frozen in Time - Lunanella</p>
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

  .lang-area a{
    font-size: 20px!important;
  }
  
  .lang-area i{
    font-size: 16px!important;
  }

  footer {
    line-height: 2em;
  }

  footer a{
    font-size: 15px!important
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

#info {
  transition: margin-top 1s, transform .25s, backdrop-filter .25s, background-color .25s
}

.loaded+#info {
  margin-top: -25px
}

.block {
  background-color: var(--w-alpha-90);
  -webkit-backdrop-filter: var(--filter-glass-1);
  backdrop-filter: var(--filter-glass-1);
  width: calc(100% - 40px);
  padding-top: 20px;
  padding-bottom: 50px;
  text-align: center;
  transition: .25s;
  border-radius: 10px
}

.block+.block {
  margin-top: 50px
}

.block:hover {
  background-color: var(--w-alpha-90);
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

.block>p {
  font-size: 14px;
  margin-block-start: 0
}

.time-display{
  font-size: 15px;
  font-weight: 800;
}

.time-timezone{
  opacity: 0.5;
}

.info {
  position: absolute;
  right: calc((100% - 200px)*.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info>view{
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

.media-box>a{
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

footer a {
  position: relative;
  border-bottom: 1px solid transparent;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
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

@media (max-width: 660px) {
  .info {
    position: static
  }

  .info {
    transform: scale(.9)
  }

  .info h2{
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
}
</style>
