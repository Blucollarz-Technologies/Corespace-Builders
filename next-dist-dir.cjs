const os = require('node:os')
const path = require('node:path')

function isOneDriveProject() {
  return process.platform === 'win32' && process.cwd().toLowerCase().includes('onedrive')
}

function getLocalDistDir() {
  return path.join(process.env.LOCALAPPDATA || os.tmpdir(), 'Corespace-Builders', 'next-dist')
}

/**
 * Next.js joins distDir with the project root on Windows, so absolute paths break
 * (project\C:\Users\...). Always return a project-relative path.
 */
function getNextDistDir() {
  if (process.env.NEXT_DIST_DIR) {
    return process.env.NEXT_DIST_DIR
  }

  // OneDrive corrupts .next symlinks (EINVAL readlink). Use a cache folder instead.
  if (isOneDriveProject()) {
    return path.join('node_modules', '.cache', 'corespace-next')
  }

  return '.next'
}

/** All dist folders that may exist from older setups (safe to delete). */
function getNextDistDirsToClean() {
  const dirs = new Set([
    '.next',
    path.join('node_modules', '.cache', 'next'),
    path.join('node_modules', '.cache', 'corespace-next'),
    getLocalDistDir(),
  ])

  return [...dirs]
}

module.exports = { getLocalDistDir, getNextDistDir, getNextDistDirsToClean, isOneDriveProject }
