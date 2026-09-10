const os = require('node:os')
const path = require('node:path')

function getNextDistDir() {
  if (process.env.VERCEL) {
    return '.next'
  }

  if (process.env.NEXT_DIST_DIR) {
    return process.env.NEXT_DIST_DIR
  }

  return 'node_modules/.cache/next'
}

module.exports = { getNextDistDir }
