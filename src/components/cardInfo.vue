<script setup lang="ts">
defineProps<{
    info: {
        loc: string,
        email: string,
        GPGFingerprint: String,
        GPGUrl: string
    },
    time: {
        shortTime: string,
        timezone: string
    },
    loaded: boolean
}>()
</script>
<template>
    <div class="wrapper flex-row content-center" aria-hidden>
        <div data-nosnippet :class="['card', 'blanked', loaded ? 'loaded' : '', 'mini', '']">
            <div class="row flex-row">
                <img class="icon" src="/assets/icons/location.svg" height="22" width="22" />
                <a class="text" target="_blank" :href="`https://time.is/${info.loc}`">
                    {{ info.loc }}
                </a>
            </div>
            <div class="row flex-row">
                <img class="icon" src="/assets/icons/time.svg" height="22" width="22" />
                <a class="text" target="_blank" :href="`https://time.is/${info.loc}`">
                    {{ time.shortTime }}
                    <span class="alpha-50">({{ time.timezone }})</span>
                </a>
            </div>
            <div class="row flex-row">
                <img class="icon" src="/assets/icons/email.svg" height="22" width="22" />
                <a class="text" target="_blank" href="mailto:i@qqzhi.cc">
                    {{ info.email }}
                </a>
            </div>
            <div class="row flex-row">
                <img class="icon" src="/assets/icons/key.svg" height="22" width="22" />
                <a class="text monospace" target="_blank" v-html="info.GPGFingerprint" :href="info.GPGUrl"></a>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    width: 100%;
    opacity: 0.7;

    &:hover {
        opacity: unset;
    }
}

.card {
    transform: scale(0.8);
    margin: -5px;
    position: absolute;

    &:hover {
        box-shadow: var(--b-alpha-30) 0 10px 30px;
    }
}

.row {
    margin: 5px 0;
}

.icon {
    margin: 0 5px;
}

.text {
    font-size: 15px;
    font-weight: 800;
    white-space: nowrap;
    opacity: 0.6;
}
</style>