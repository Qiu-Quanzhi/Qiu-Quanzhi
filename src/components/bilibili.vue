<script setup lang="ts">
  defineProps<{
    aid?: number,
    bvid?: string,
    cid?: number
  }>()
  const check=(e:any)=>{
    console.log(e)
    console.log("ERR:Bilibili")
  }
</script>
<template>
  <iframe referrerpolicy="origin" title="哔哩哔哩" class="player" :src="`https://player.bilibili.com/player.html?aid=${aid||''}&bvid=${bvid||''}&cid=${cid||''}&high_quality=1&danmaku=1&as_wide=1&poster=0&autoplay=0`" 
  @error="check" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
</template>