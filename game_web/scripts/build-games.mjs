import { build, loadEnv } from 'vite'
import { createHash } from 'node:crypto'
import { copyFile, readFile, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
const root = fileURLToPath(new URL('..', import.meta.url))
const mode = process.argv.includes('--development') ? 'development' : 'production'
const env = loadEnv(mode, fileURLToPath(new URL('../..', import.meta.url)), '')
const platform = (process.env.VITE_PLATFORM_URL || env.VITE_PLATFORM_URL || (mode === 'development' ? 'http://127.0.0.1:1431' : 'https://games.b14f.com')).replace(/\/$/, '')
const sdk = await readFile(new URL('../../sdk/js/gamelink.js', import.meta.url), 'utf8')
// Retire the old shared generated bundles; game sources live outside this directory.
await rm(new URL('../public/games', import.meta.url), { recursive: true, force: true })
for (const game of ['tank', 'four-wheel', 'doodle', 'flight-chess', 'whiteboard', 'street-racer', 'poetry', 'watch-tv', 'wild-hearth']) {
  process.env.GAMELINK_BUILD_GAME = game
  await build({ root, configFile: fileURLToPath(new URL('../vite.games.config.ts', import.meta.url)), mode })
  const assets = new URL(`../public/${game}/assets/`, import.meta.url)
  await writeFile(new URL('gamelink.js', assets), sdk.replace('serverUrl = new URL(import.meta.url).origin', `serverUrl = ${JSON.stringify(platform)}`))
  for (const icon of ['favicon.ico', 'favicon.svg', 'gamelink-icon.png']) {
    await copyFile(new URL(`../public/${icon}`, import.meta.url), new URL(icon, assets))
  }
  // Standalone game pages use system font fallbacks, without an external font fetch.
  const css = new URL('style.css', assets)
  await writeFile(css, (await readFile(css, 'utf8')).replace(/@import\s+url\([^)]*fonts\.googleapis\.com[^)]*\);?/g, ''))
  // Refresh stable standalone filenames whenever their contents change.
  const entry = new URL(`../public/${game}/index.html`, import.meta.url)
  let html = await readFile(entry, 'utf8')
  for (const resource of ['game.js', 'style.css']) {
    const digest = createHash('sha256').update(await readFile(new URL(resource, assets))).digest('hex').slice(0,12)
    html = html.replace(new RegExp(`(assets/${resource.replace('.', '\\.')})(?:\\?v=[^"'\\s<>]+)?`, 'g'), `$1?v=${digest}`)
  }
  await writeFile(entry, html)
}
delete process.env.GAMELINK_BUILD_GAME
await copyFile(new URL('../../sdk/js/gamelink.js', import.meta.url), new URL('../public/gamelink.js', import.meta.url))
