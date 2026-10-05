<script setup lang="ts">
defineProps<{ name: string; value?: number }>()
const paths: Record<string, string> = {"menu": "M4 6h16M4 12h16M4 18h16", "close": "m6 6 12 12M6 18 18 6", "invite": "M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0M4 21v-2a6 6 0 0 1 9-5.2M18 14v8M14 18h8", "copy": "M9 9h11v12H9zM5 15H3V3h12v2", "exit": "M10 4H4v16h6M10 12h11m-4-4 4 4-4 4", "download": "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5", "help": "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4M12 17h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0", "refresh": "M20 7v5h-5M4 17v-5h5M5 8a8 8 0 0 1 13-3l2 3M4 16l2 3a8 8 0 0 0 13-3", "pan": "M12 3v18M3 12h18m-12-6 3-3 3 3m-6 12 3 3 3-3M6 9l-3 3 3 3m12-6 3 3-3 3", "pen": "m4 16-1 5 5-1L20 8a3 3 0 0 0-4-4ZM14 6l4 4", "pencil": "m4 15-1 6 6-1L21 8l-5-5ZM13 6l5 5M4 15l5 5", "marker": "m5 14 9-11 7 6-9 11ZM5 14l7 6-8 1-2-2ZM12 6l7 6", "highlighter": "m7 13 7-10 7 5-7 10ZM7 13l7 5-3 3H4v-4ZM3 22h18", "spray": "M5 10h9v11H5zM7 10V6h5v4M8 6V3h3M16 4h.01M20 2h.01M20 6h.01M18 9h.01", "neon": "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z", "crayon": "m4 15 10-10 5 5L9 20H4ZM14 5l4-3 4 4-3 4M7 12l5 5", "eraser": "m4 16 9-11a2 2 0 0 1 3 0l5 5a2 2 0 0 1 0 3l-8 8H8l-4-4a1 1 0 0 1 0-1ZM9 10l8 8M13 21h8", "undo": "M3 4v6h6M3 10c3-7 17-6 17 3 0 5-5 7-10 6", "redo": "M21 4v6h-6M21 10C18 3 4 4 4 13c0 5 5 7 10 6", "plus": "M12 5v14M5 12h14", "minus": "M5 12h14", "target": "M12 2v4M12 18v4M2 12h4M18 12h4M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0M12 12h.01", "check": "m5 12 4 4L19 6", "play": "m8 4 12 8-12 8Z", "trash": "M3 6h18M8 6V3h8v3M5 6l1 15h12l1-15M10 10v7M14 10v7", "volume": "m3 9 5 0 5-5v16l-5-5H3ZM16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14", "muted": "m3 9 5 0 5-5v16l-5-5H3ZM17 9l5 6M17 15l5-6", "plane": "m22 2-7 20-4-9-9-4ZM11 13l6-6"}
const pips: Record<number, number[][]> = { 1:[[12,12]], 2:[[7,7],[17,17]], 3:[[7,7],[12,12],[17,17]], 4:[[7,7],[17,7],[7,17],[17,17]], 5:[[7,7],[17,7],[12,12],[7,17],[17,17]], 6:[[7,6],[17,6],[7,12],[17,12],[7,18],[17,18]] }
</script>
<template>
  <svg class="gl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <template v-if="name === 'dice'"><rect x="2" y="2" width="20" height="20" rx="4"/><circle v-for="(point,index) in pips[value || 5]" :key="index" :cx="point[0]" :cy="point[1]" r="1.3" fill="currentColor" stroke="none"/></template>
    <path v-else :d="paths[name] || paths.help"/>
  </svg>
</template>
<style scoped>
.gl-icon { display:inline-block; width:18px; height:18px; flex:none; vertical-align:middle; pointer-events:none; }
</style>
