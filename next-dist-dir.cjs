const os = require('node:os')
const path = require('node:path')

function isOneDriveProject() {
  return process.platform === 'win32' && process.cwd().toLowerCase().includes('onedrive')
}

function getLocalDistDir() {
  return path.join(process.env.LOCALAPPDATA || os.tmpdir(), 'Corespace-Builders', 'next-dist')
}

function getNextDistDir() {
  if (process.env.VERCEL) {
    return '.next'
  }

  if (process.env.NEXT_DIST_DIR) {
    return process.env.NEXT_DIST_DIR
  }

  return 'node_modules/.cache/next'
}

/** All dist folders that may exist from older setups (safe to delete). */
function getNextDistDirsToClean() {
  const dirs = new Set(['.next', 'node_modules/.cache/next', getLocalDistDir()])

  return [...dirs]
}

module.exports = { getLocalDistDir, getNextDistDir, getNextDistDirsToClean, isOneDriveProject }
