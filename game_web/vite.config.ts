import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig(({ mode }) => {
  const repositoryRoot = fileURLToPath(new URL('..', import.meta.url))
  const env = loadEnv(mode, repositoryRoot, '')
  const buildDate = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Shanghai',
    year: '2-digit', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date())
  const datePart = (type: string) => buildDate.find(part => part.type === type)?.value || ''
  const buildVersion = `${datePart('year')}.${datePart('month')}${datePart('day')}.${datePart('hour')}${datePart('minute')}`
  return {
    plugins: [vue()],
    define: { 'import.meta.env.VITE_BUILD_VERSION': JSON.stringify(buildVersion) },
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
