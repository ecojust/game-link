<script setup lang="ts">
import {cardArt,heroes} from './cards'
import type {Card} from './cards'
defineProps<{card:Card}>()
</script>
<template>
<article class="spell-card card-face" :aria-label="`${card.name}，${card.cost} 费，${card.text}`">
<span class="card-cost">{{card.cost}}</span>
<div class="card-art" :class="`art-${card.kind}`"><img :src="cardArt(card.id)" :alt="card.name" loading="lazy" decoding="async"/></div>
<b>{{card.name}}</b><p>{{card.text}}</p>
<small class="card-stats">{{card.kind==='unit'?`${card.attack} 攻 / ${card.health} 血`:'法术'}}</small>
<small class="card-origin">{{card.hero?heroes[card.hero].name:'中立'}}</small>
</article>
</template>
