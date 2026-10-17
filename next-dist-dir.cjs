const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

function isOneDriveProject(cwd = process.cwd()) {
  return process.platform === 'win32' && cwd.toLowerCase().includes('onedrive')
}

function getLocalDistDir() {
  return path.join(process.env.LOCALAPPDATA || os.tmpdir(), 'Corespace-Builders', 'next-dist')
}

/**
 * Keep distDir inside the project. Moving it outside OneDrive breaks ESM
 * package resolution for Payload/Next.
 *
 * OneDrive EINVAL: wipe `.next` before each `bun run dev` (see prepare-dev.mjs).
 */
function getNextDistDir() {
  if (process.env.NEXT_DIST_DIR) {
    return process.env.NEXT_DIST_DIR
  }

  return '.next'
}

function getNextDistDirsToClean(projectRoot = process.cwd()) {
  return [
    path.join(projectRoot, '.next'),
    path.join(projectRoot, 'node_modules', '.cache', 'next'),
    path.join(projectRoot, 'node_modules', '.cache', 'corespace-next'),
    // Legacy leftover from earlier workarounds
    getLocalDistDir(),
  ]
}

function removeDirSafe(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return false
  }

  try {
    const stat = fs.lstatSync(targetPath)
    if (stat.isSymbolicLink()) {
      fs.rmdirSync(targetPath)
      return true
    }
  } catch {
    // fall through
  }

  fs.rmSync(targetPath, { recursive: true, force: true, maxRetries: 5 })
  return true
}

module.exports = {
  getLocalDistDir,
  getNextDistDir,
  getNextDistDirsToClean,
  isOneDriveProject,
  removeDirSafe,
}
