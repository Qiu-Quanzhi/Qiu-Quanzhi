<script setup lang="ts">
import icon from "components/icon.vue";
defineProps<{
    info: object,
    time: object,
    loaded: boolean
}>()
</script>
<template>
    <div data-nosnippet :class="['card', 'blanked', loaded ? 'loaded' : '', 'mini']">
        <div class="flex-row">
            <icon size="" name="location"></icon>
            <a class="text" target="_blank" :href="`https://time.is/${info.loc}`">
                {{ `${info.loc} ${time.shortTime}` }}
                <span class="alpha-50">({{ time.timezone }})</span>
            </a>
        </div>
    </div>
</template>

<style scoped>
.text {
    font-size: 15px;
    font-weight: 800;
}
</style>