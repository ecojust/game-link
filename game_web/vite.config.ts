import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig(({ mode }) => {
  const repositoryRoot = fileURLToPath(new URL('..', import.meta.url))
  const env = loadEnv(mode, repositoryRoot, '')
  return {
    plugins: [vue()],
    server: {
      fs: { allow: [repositoryRoot] },
      host: '127.0.0.1',
      port: 1431,
      strictPort: true,
      proxy: {
        '/v1': {
          target: env.VITE_API_TARGET || 'http://127.0.0.1:8088',
          changeOrigin: true,
        },
      },
    },
  }
})
