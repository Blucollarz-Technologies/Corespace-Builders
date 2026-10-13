import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { getLocalDistDir, removeDirSafe } = require('../next-dist-dir.cjs')

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

spawnSync(process.execPath, [path.join(root, 'scripts/kill-port.mjs'), '3000'], {
  cwd: root,
  stdio: 'inherit',
})

// OneDrive corrupts Next cache files (EINVAL readlink). Always start fresh.
for (const target of [
  path.join(root, '.next'),
  path.join(root, 'node_modules', '.cache', 'corespace-next'),
  getLocalDistDir(),
]) {
  if (removeDirSafe(target)) {
    console.log(`Removed ${target}`)
  }
}

console.log('Next.js cache cleared for OneDrive-safe start.')
