import { execSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { getNextDistDirsToClean } = require('../next-dist-dir.cjs')

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function killPort(port) {
  if (process.platform !== 'win32') {
    return
  }

  try {
    const output = execSync(`netstat -ano | findstr :${port}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    })

    const pids = new Set()

    for (const line of output.split(/\r?\n/)) {
      if (!line.includes('LISTENING')) {
        continue
      }

      const pid = line.trim().split(/\s+/).at(-1)

      if (pid && pid !== '0') {
        pids.add(pid)
      }
    }

    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F /T`, { stdio: 'ignore' })
        console.log(`Stopped process on port ${port} (PID ${pid})`)
      } catch {
        // Process may already be gone.
      }
    }
  } catch {
    // Nothing listening on the port.
  }
}

function cleanNextDirs() {
  for (const relativeOrAbsolutePath of getNextDistDirsToClean()) {
    const target = path.isAbsolute(relativeOrAbsolutePath)
      ? relativeOrAbsolutePath
      : path.join(root, relativeOrAbsolutePath)

    if (!existsSync(target)) {
      continue
    }

    try {
      rmSync(target, { recursive: true, force: true })
      console.log(`Removed ${target}`)
    } catch (error) {
      console.warn(`Could not remove ${target}:`, error.message)
    }
  }
}

async function main() {
  killPort(3000)

  // Give Windows a moment to release the port and file handles.
  await sleep(1500)

  cleanNextDirs()

  console.log('Next.js cache cleared. Starting dev server...')
}

await main()
