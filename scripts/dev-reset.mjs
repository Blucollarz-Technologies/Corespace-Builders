import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { getNextDistDirsToClean, removeDirSafe } = require('../next-dist-dir.cjs')

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

      const processId = line.trim().split(/\s+/).at(-1)

      if (processId && processId !== '0') {
        pids.add(processId)
      }
    }

    for (const processId of pids) {
      try {
        execSync(`taskkill /PID ${processId} /F /T`, { stdio: 'ignore' })
        console.log(`Stopped process on port ${port} (PID ${processId})`)
      } catch {
        // Process may already be gone.
      }
    }
  } catch {
    // Nothing listening on the port.
  }
}

function cleanNextDirs() {
  for (const target of getNextDistDirsToClean(root)) {
    if (removeDirSafe(target)) {
      console.log(`Removed ${target}`)
    }
  }
}

async function main() {
  killPort(3000)
  await sleep(1500)
  cleanNextDirs()
  console.log('Next.js cache cleared.')
}

await main()
