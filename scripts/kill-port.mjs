import { execSync } from 'node:child_process'

const port = process.argv[2] || '3000'

if (process.platform !== 'win32') {
  process.exit(0)
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
      console.log(`Freed port ${port} (stopped PID ${processId})`)
    } catch {
      // Already gone.
    }
  }
} catch {
  // Nothing listening.
}
