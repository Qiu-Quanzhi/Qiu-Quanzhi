<script setup lang="ts">
import icon from "components/icon.vue";
defineProps<{
    info: {
        loc: string,
        email: string
    },
    time: {
        shortTime: string,
        timezone: string
    },
    loaded: boolean
}>()
</script>
<template>
    <div data-nosnippet :class="['card', 'blanked', loaded ? 'loaded' : '', 'mini']">
        <div class="row flex-row">
            <icon class="icon" name="location"></icon>
            <a class="text" target="_blank" :href="`https://time.is/${info.loc}`">
                {{ info.loc }}
            </a>
        </div>
        <div class="row flex-row">
            <icon class="icon" name="time"></icon>
            <a class="text" target="_blank" :href="`https://time.is/${info.loc}`">
                {{ time.shortTime }}
                <span class="alpha-50">({{ time.timezone }})</span>
            </a>
        </div>
        <div class="row flex-row">
            <icon class="icon" name="mail"></icon>
            <a class="text" target="_blank" href="mailto:i@qqzhi.cc">
                {{ info.email }}
            </a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.card {
    transform: scale(0.8);
    margin: -5px;
    &:hover {
        box-shadow: var(--b-alpha-30) 0 10px 30px;
    }
}
.row{
    margin: 5px 0;
    opacity: 0.6;
}
.icon {
    margin: 0 5px;
}
.text {
    font-size: 15px;
    font-weight: 800;
}
</style>