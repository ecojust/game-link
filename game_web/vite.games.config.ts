import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {createHash} from 'node:crypto'
import {readFileSync} from 'node:fs'
const sdkVersion=createHash('sha256').update(readFileSync(new URL('../sdk/js/gamelink.js',import.meta.url))).digest('hex').slice(0,12)
export default defineConfig(() => {
  const game = process.env.GAMELINK_BUILD_GAME
  if (!['tank', 'four-wheel', 'doodle', 'flight-chess', 'whiteboard', 'street-racer', 'poetry', 'watch-tv', 'wild-hearth'].includes(game || '')) throw new Error('Use scripts/build-games.mjs to build the standalone games')
  return {
    publicDir: false,
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    plugins: [vue(), {
      name: 'external-gamelink-sdk',
      enforce: 'pre',
      resolveId(source: string) {
        if (source.endsWith('/sdk/js/gamelink.js')) return { id: `./gamelink.js?v=${sdkVersion}`, external: true }
      },
    }],
    build: {
      outDir: `public/${game}/assets`, emptyOutDir: true, cssCodeSplit: false,
      lib: {
        entry: `src/gamesource/${game}/main.ts`,
        formats: ['es'], fileName: () => 'game.js', cssFileName: 'style',
      },
    },
  }
})
