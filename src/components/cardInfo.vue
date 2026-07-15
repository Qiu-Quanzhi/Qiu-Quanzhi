<script setup lang="ts">
interface CardInfoData {
    loc: string;
    birthday: string;
    GPGFingerprint: string;
    GPGUrl: string;
}

interface CardTimeData {
    shortTime: string;
    timezone: string;
}

const props = defineProps<{
    info: CardInfoData;
    time: CardTimeData;
    loaded: boolean;
}>()

const cardRows = [
    { icon: 'location.svg', href: `https://time.is/${props.info.loc}`, text: props.info.loc, type: 'text' as const },
    { icon: 'time.svg', href: `https://time.is/${props.info.loc}`, text: props.time.shortTime, timezone: props.time.timezone, type: 'time' as const },
    { icon: 'birthday.svg', href: 'https://en.wikipedia.org/wiki/Longtaitou_Festival', text: props.info.birthday, type: 'text' as const },
    { icon: 'key.svg', href: props.info.GPGUrl, fingerprint: props.info.GPGFingerprint, type: 'fingerprint' as const },
]
</script>
<template>
    <div class="wrapper flex-col content-center">
        <div data-nosnippet class="card blanked mini" :class="{ loaded: loaded }">
            <div v-for="row in cardRows" :key="row.icon" class="row flex-row">
                <img aria-hidden="true"  class="icon" loading="lazy" :src="`/assets/icons/${row.icon}`" height="22" width="22">
                <a v-if="row.type === 'time'" class="text nowrap" target="_blank" :href="row.href">
                    {{ row.text }}
                    <span class="alpha-50">({{ row.timezone }})</span>
                </a>
                <a v-else-if="row.type === 'fingerprint'" class="text nowrap monospace" target="_blank" v-html="row.fingerprint" :href="row.href"></a>
                <a v-else class="text nowrap" target="_blank" :href="row.href">{{ row.text }}</a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.wrapper {
    opacity: var(--opacity-dim);
    &:hover { opacity: unset; }
}

.card {
    transform: scale(0.8);
    margin-left: 20px;
    position: absolute;
    &:hover { box-shadow: var(--overlay-30) 0 10px 30px; }
}

.row { margin: 5px 0; }

.icon { margin: 0 5px; }

.text {
    font-size: var(--text-md);
    font-weight: 800;
    opacity: 0.6;
}

@media (max-width: 1000px) {
    .wrapper { align-items: center; }
    .card { margin-left: 0; position: unset; }
}
</style>