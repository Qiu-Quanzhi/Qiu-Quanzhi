<script setup lang="ts">
import blog from './show/blog.vue'
import bilibili from './show/bilibili.vue'
import netease from './show/netease.vue'
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
type BilibiliItem = { aid?: number, bvid?: string, cid?: number, title: string }
const list = ref<{ bilibili_list: Array<BilibiliItem> }>({ bilibili_list: [] })
fetch('/assets/data/works.json')
    .then((response) => {
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return response.json();
    })
    .then((json: { bilibili_list: Array<BilibiliItem> }) => {
        list.value = json;
        bilibili_index.value = 0;
    })
    .catch((error) => {
        console.error('Failed to load works data:', error);
        list.value = { bilibili_list: [] };
    })
const bilibili_index = ref(-1)
const tab=ref('blog')
</script>
<template>
    <view class="selection-box flex-row">
        <view @click="tab='bilibili'" class="flex-col item-center">
            <img :alt="t('aria.Bilibili')" :class="['selection',tab=='bilibili'?'selected':'']" :src="`assets/icons/Bilibili.svg`"/>
            <span v-show="tab=='bilibili'" class="underline2"></span>
            <a target="_blank" href="https://space.bilibili.com/1036651852" :class="['selection-id',tab=='bilibili'?'selected':'']">{{ t('parts.show.tabs.bilibili.name') }}<br><text>({{ t('parts.show.tabs.bilibili.enter') }})</text></a>
        </view>
        <view @click="tab='blog'" class="flex-col item-center">
            <img :alt="t('aria.blog')" :class="['selection',tab=='blog'?'selected':'']" :src="`assets/icons/blog.png`"/>
            <span v-show="tab=='blog'" class="underline2"></span>
            <a target="_blank" href="https://home.qqzhi.cc/" :class="['selection-id',tab=='blog'?'selected':'']">{{ t('parts.show.tabs.blog.name') }}<br><text>({{ t('parts.show.tabs.blog.enter') }})</text></a>
        </view>
        <view @click="tab='netease'" class="flex-col item-center">
            <img :alt="t('aria.Netease')" :class="['selection',tab=='netease'?'selected':'']" :src="`assets/icons/Netease.svg`"/>
            <span v-show="tab=='netease'" class="underline2"></span>
            <a target="_blank"  href="https://music.163.com/#/artist?id=55151766" :class="['selection-id',tab=='netease'?'selected':'']">{{ t('parts.show.tabs.netease.name') }}<br><text>({{ t('parts.show.tabs.netease.enter') }})</text></a>
        </view>
    </view>
    <view v-if="tab=='bilibili'" class="show-box flex-row content-center" lang="zh-CN">
        <view class="media">
            <bilibili class="player" v-if="bilibili_index != -1" :aid="list.bilibili_list[bilibili_index].aid"
                :bvid="list.bilibili_list[bilibili_index].bvid" :cid="list.bilibili_list[bilibili_index].cid"></bilibili>
        </view>
        <view class="list flex-col">
            
            <view @click="bilibili_index = index" :class="['list-item', index == bilibili_index ? 'selected' : '']"
                v-for="(item, index) in list.bilibili_list">
                <span>{{ item.title }}</span>
            </view>
        </view>
    </view>
    <view v-if="tab=='blog'" class="show-box flex-row content-center" lang="zh-CN">
        <blog class="blog viewer"></blog>
    </view>
    <view v-if="tab=='netease'" class="show-box flex-row content-center" lang="zh-CN">
        <netease class="netease viewer"></netease>
    </view>
</template>
<style scoped>
.selection-box{
    margin: 10px;
}
.media-tip{
    margin-top: 5px;
    margin-left: 5px;
    z-index: 20;
    position: absolute;
    color: var(--w-alpha-90-fixed);
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