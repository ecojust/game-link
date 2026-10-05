<script setup lang="ts">
import UiIcon from "./UiIcon.vue"
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{ gameId: string; roomCode?: string; memberCount: number; maxMembers: number; variant?: 'battle' | 'doodle' | 'flight' | 'whiteboard' }>(), { variant: 'battle' })
const dialog = ref<HTMLDialogElement>()
const copied = ref(false)
const link = computed(() => {
  if (!props.roomCode) return ''
  const url = new URL('/', window.location.href)
  url.hash = `/invite?${new URLSearchParams({ gameid: props.gameId, room: props.roomCode }).toString()}`
  return url.href
})
const full = computed(() => props.memberCount >= props.maxMembers)
async function invite() {
  if (!link.value || full.value) return
  copied.value = false
  dialog.value?.showModal()
  try { await navigator.clipboard.writeText(link.value); copied.value = true } catch { copied.value = false }
}
async function copy() {
  try { await navigator.clipboard.writeText(link.value); copied.value = true } catch { copied.value = false }
}
</script>

<template>
  <button class="gl-action room-invite-trigger" :class="`invite-${variant}`" type="button" :disabled="!roomCode || full" :title="full ? '房间已满，无法邀请' : '生成并复制房间邀请链接'" @click="invite"><UiIcon name="invite" />邀请</button>
  <dialog ref="dialog" class="room-invite-dialog" aria-labelledby="room-invite-title">
    <form method="dialog" class="room-invite-panel">
      <button class="gl-action room-invite-close" aria-label="关闭"><UiIcon name="close" /></button>
      <small>GAMELINK / ROOM INVITE</small>
      <h2 id="room-invite-title">邀请好友加入</h2>
      <p>分享链接，好友打开后会自动加入房间。</p>
      <input :value="link" readonly aria-label="房间邀请链接" @focus="($event.target as HTMLInputElement).select()" />
      <button type="button" class="gl-action room-invite-copy" @click="copy"><UiIcon :name="copied ? 'check' : 'copy'" />{{ copied ? '已复制邀请链接' : '复制邀请链接' }}</button>
    </form>
  </dialog>
</template>

<style scoped>
.room-invite-dialog { width:min(440px,calc(100% - 32px)); padding:0; border:1px solid #758070; background:#17231f; color:#e8ebd8; box-shadow:0 18px 60px #0009; }
.room-invite-dialog::backdrop { background:#090f0dbb; backdrop-filter:blur(3px); }
.room-invite-panel { position:relative; display:grid; gap:12px; padding:26px; font:13px/1.5 system-ui,sans-serif; }
.room-invite-panel small { color:#b5ce83; letter-spacing:.14em; font-size:10px; }
.room-invite-panel h2 { margin:0; font-size:22px; }
.room-invite-panel p { margin:0; color:#bac5b6; }
.room-invite-panel input { min-width:0; padding:10px; border:1px solid #526254; background:#101915; color:#dce7ce; font:12px ui-monospace,monospace; }
.room-invite-copy { padding:10px; border:0; background:#d5e49a; color:#1b241d; font-weight:700; cursor:pointer; }
.room-invite-close { position:absolute; top:12px; right:12px; border:0; background:transparent; color:#e8ebd8; font-size:22px; cursor:pointer; }
</style>
