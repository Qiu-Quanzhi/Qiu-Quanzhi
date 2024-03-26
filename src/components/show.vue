<script setup lang="ts">
import blog from './blog.vue'
import bilibili from './bilibili.vue'
import netease from './netease.vue'
import { ref } from "vue";
type bilibili = { aid?: number, bvid?: string, cid?: number, title: string }
const list = ref<{ bilibili_list: Array<bilibili> }>({ bilibili_list: [] })
fetch('/assets/data/works.json')
    .then((response) => response.json())
    .then((json: { bilibili_list: Array<bilibili> }) => {

        list.value = json
        bilibili_index.value = 0
    })
const bilibili_index = ref(-1)
const tab=ref('weixin')
</script>
<template>
    <view class="selection-box flex-row">
        <view @click="tab='bilibili'" class="flex-col item-center">
            <img alt="哔哩哔哩" :class="['selection',tab=='bilibili'?'selected':'']" :src="`assets/icons/Bilibili.svg`"/>
            <span v-show="tab=='bilibili'" class="underline2"></span>
            <a target="_blank" href="https://space.bilibili.com/1036651852" :class="['selection-id',tab=='bilibili'?'selected':'']">@旅禾Tristan<br><text>(点此进入主页)</text></a>
        </view>
        <view @click="tab='weixin'" class="flex-col item-center">
            <img alt="微信公众号" :class="['selection',tab=='weixin'?'selected':'']" :src="`assets/icons/Weixin.svg`"/>
            <span v-show="tab=='weixin'" class="underline2"></span>
            <a target="_blank" href="https://blog.qqzhi.cc/" :class="['selection-id',tab=='weixin'?'selected':'']">@旅禾Tristan<br><text>(停书笥 代展)</text></a>
        </view>
        <view @click="tab='netease'" class="flex-col item-center">
            <img alt="网易云音乐" :class="['selection',tab=='netease'?'selected':'']" :src="`assets/icons/Netease.svg`"/>
            <span v-show="tab=='netease'" class="underline2"></span>
            <a target="_blank"  href="https://music.163.com/#/artist?id=55151766" :class="['selection-id',tab=='netease'?'selected':'']">@旅禾<br><text>(点此进入主页)</text></a>
        </view>
    </view>
    <view v-if="tab=='bilibili'" class="show-box flex-row content-center" lang="zh-CN">
        <view class="media">
            <a target="_blank" v-if="bilibili_index != -1" :href="`https://www.bilibili.com/video/${list.bilibili_list[bilibili_index].bvid||list.bilibili_list[bilibili_index].aid}`" class="media-tip">点此进入原视频</a>
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
    <view v-if="tab=='weixin'" class="show-box flex-row content-center" lang="zh-CN">
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
    color: var(---w-alpha-90);
}
.viewer{
    border-radius: 10px;
    background-color: var(--w-alpha-90);
}
.blog.viewer{
    width: calc((100vw - 80px));
    height: 80vh;
}
.netease.viewer{
    width: calc((100vw - 80px) * 0.5);
    height: calc(80vh * 0.5);
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
    opacity: 0.9;
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
    width: calc((100vw - 80px));
}

@media screen and (max-width: 660px) {
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

.player {
    width: calc((100vw - 80px) * 0.5);
    height: calc((100vw - 80px) * 0.5 / 16 * 9);
    z-index: 10;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    background: url('../assets/icons/Bilibili.svg') no-repeat center;
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