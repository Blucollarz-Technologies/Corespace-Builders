/**
 * When Next distDir lives outside the project (OneDrive workaround),
 * Node resolves modules from the real cache path and misses project deps.
 * Force fallback resolution into the project node_modules.
 */
const path = require('node:path')
const Module = require('node:module')

const projectRoot = path.resolve(__dirname, '..')
const projectNodeModules = path.join(projectRoot, 'node_modules')
const originalResolveFilename = Module._resolveFilename

Module._resolveFilename = function patchedResolveFilename(request, parent, isMain, options) {
  try {
    return originalResolveFilename.call(this, request, parent, isMain, options)
  } catch (error) {
    if (error?.code !== 'MODULE_NOT_FOUND') {
      throw error
    }

    const extraPaths = Module._nodeModulePaths(projectRoot)
    const mergedPaths = [
      projectNodeModules,
      ...extraPaths,
      ...((options && options.paths) || []),
      ...((parent && parent.paths) || []),
    ]

    return originalResolveFilename.call(this, request, parent, isMain, {
      ...(options || {}),
      paths: mergedPaths,
    })
  }
}
