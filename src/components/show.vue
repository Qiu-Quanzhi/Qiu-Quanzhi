<script setup lang="ts">
import blog from './show/blog.vue'
import bilibili from './show/bilibili.vue'
import netease from './show/netease.vue'
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { showTabs } from '@/data'
const { t } = useI18n();
type BilibiliItem = { aid?: number, bvid?: string, cid?: number, title: string }

const list = ref<{ bilibili_list: Array<BilibiliItem> }>({ bilibili_list: [] })
const bilibili_index = ref(-1)
const tab = ref('blog')
const loading = ref(false)
const error = ref(false)

onMounted(async () => {
  loading.value = true
  const link1 = document.createElement('link');
  link1.rel = 'preconnect';
  link1.href = 'https://player.bilibili.com';
  link1.crossOrigin = 'use-credentials';
  document.head.appendChild(link1);

  const link2 = document.createElement('link');
  link2.rel = 'preconnect';
  link2.href = 'https://music.163.com';
  link2.crossOrigin = 'use-credentials';
  document.head.appendChild(link2);
  
  try {
    const response = await fetch('/assets/data/bilibili-videos.json')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const json: { bilibili_list: Array<BilibiliItem> } = await response.json()
    list.value = json
    bilibili_index.value = json.bilibili_list.length > 0 ? 0 : -1
  } catch (e) {
    console.error('Failed to load works data:', e)
    error.value = true
  } finally {
    loading.value = false
  }
})

const tabComponents: Record<string, any> = { bilibili, blog, netease }
const currentTabComponent = computed(() => tabComponents[tab.value])
</script>
<template>
    <div class="selection-box flex-row">
        <div v-for="tabItem in showTabs" :key="tabItem.id" @click="tab = tabItem.id" class="flex-col item-center">
            <img :alt="t(tabItem.ariaKey)" :class="['selection', tab == tabItem.id ? 'selected' : '']" loading="lazy" :src="tabItem.icon"/>
            <span v-show="tab == tabItem.id" class="underline2"></span>
            <a target="_blank" :href="tabItem.href" :class="['selection-id', tab == tabItem.id ? 'selected' : '']">{{ t(tabItem.nameKey) }}<br><text>({{ t(tabItem.enterKey) }})</text></a>
        </div>
    </div>
    <div v-if="tab=='bilibili'" class="show-box flex-row content-center" lang="zh-CN">
        <div class="media">
            <bilibili class="player" v-if="bilibili_index != -1" :aid="list.bilibili_list[bilibili_index].aid"
                :bvid="list.bilibili_list[bilibili_index].bvid" :cid="list.bilibili_list[bilibili_index].cid"></bilibili>
        </div>
        <div class="list flex-col">

            <div @click="bilibili_index = index" :class="['list-item', index == bilibili_index ? 'selected' : '']"
                v-for="(item, index) in list.bilibili_list">
                <span>{{ item.title }}</span>
            </div>
        </div>
    </div>
    <div v-else class="show-box flex-row content-center" lang="zh-CN">
        <component :is="currentTabComponent" class="viewer" :class="tab"></component>
    </div>
</template>
<style scoped>
.selection-box{
    margin: 10px;
}
.viewer{
    border-radius: 10px;
    background-color: var(--w-alpha-90);
    width: calc(100vw - 80px);
    height: 80vh;
}
.blog.viewer {
    width: calc(100vw - 80px);
    height: 80vh;
}
.netease.viewer {
    width: calc((100vw - 80px)/2);
    height: 40vh;
}
.selection{
    margin: 5px;
    width: 50px;
    height: 50px;
    opacity: 0.7;
    cursor: pointer;
}
.selection:hover{
    transform: scale(1.05);
}
.selection.selected{
    opacity: 1;
    transform: scale(1.05);
}
.selection-id{
    color: var(--txt-b);
    pointer-events: none;
    font-weight: 600;
    opacity: 0;
}
.selection-id.selected{
    pointer-events: all;
    opacity: 1;
}
text{
    color: var(--theme-color);
}
.show-box {
    width: calc((100vw - 300px));
}

@media screen and (max-width: 900px) {
    .show-box {
        flex-direction: column;
        align-items: center;
    }
    .player {
        width: calc((100vw - 80px)) !important;
        height: calc((100vw - 80px)/ 16 * 9) !important;
        border-bottom-left-radius: 0 !important;
        border-top-left-radius: 5px !important;
        border-top-right-radius: 5px;
    }

    .list {
        width: calc((100vw - 80px) - 10px) !important;
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 5px !important;
        border-bottom-left-radius: 5px;
        padding: 5px 5px !important;
        padding-top: 15px !important;
        margin-top: -5px;
        left: 0 !important;
        max-height: 30vh;
        height: unset !important;
        max-width: none !important;
    }
}

@media screen and (max-width: 660px) {
    .show-box {
        flex-direction: column;
        align-items: center;
    }

    .player {
        width: calc(100vw - 80px) !important;
        height: calc((100vw - 80px) * .5625) !important;
        border-bottom-left-radius: 0 !important;
        border-top-left-radius: 5px !important;
        border-top-right-radius: 5px;
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
        max-width: none !important;
    }
}

.player {
    width: calc((100vw - 80px) * 0.5);
    height: calc((100vw - 80px) * 0.5 / 16 * 9);
    z-index: 10;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    background: url(/assets/icons/Bilibili.svg) no-repeat center;
    background-size: 10%;
    background-color: var(--b-alpha-90);
}

.list {
    position: relative;
    background-color: var(--b-alpha-10);
    height: calc((100vw - 80px) * 0.5 / 16 * 9 - 10px);
    padding: 5px;
    border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;
    overflow-y: scroll;
    overflow-x: hidden;
    max-width: 30vw;
}

.list-item {
    margin: 3px 10px;
    padding: 10px 10px;
    border-radius: 5px;
    cursor: pointer;
}

.list-item:hover {
    transform: scale(1.05);
}

.list-item.selected {
    background-color: var(--w-alpha-90);

}

.list-item>span {
    margin: 1px 0 0;
    color: var(--txt-b);
    font-size: medium;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
}
</style>