<template>
    <svg aria-hidden="true"  :width="size" :height="size">
        <use :href="symbolId" :fill="color" :width="size" :height="size"/>
    </svg>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
    name: 'SvgIcon',
    props: {
        prefix: {
            type: String,
            default: 'icon',
        },
        name: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            default: 'var(--txt-b)',
        },
        size: {
            type: String,
            default: '22',
        },
    },
    setup(props) {
        const symbolId = computed(() => `#${props.prefix}-${props.name}`)
        return { symbolId }
    },
})
</script>