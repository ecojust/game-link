import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig(() => {
  const game = process.env.GAMELINK_BUILD_GAME
  if (!['tank', 'four-wheel', 'doodle', 'flight-chess'].includes(game || '')) throw new Error('Use scripts/build-games.mjs to build the standalone games')
  return {
    publicDir: false,
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    plugins: [vue(), {
      name: 'external-gamelink-sdk',
      enforce: 'pre',
      resolveId(source: string) {
        if (source.endsWith('/sdk/js/gamelink.js')) return { id: './gamelink.js', external: true }
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
