import slash from 'slash'

/**
 * FIXME
 * Currently an issue occurs when trying to use
 * path.join(), so I had to add path.js to utils
 * and use that. This will be investigated.
 *
 * `TypeError: path__WEBPACK_IMPORTED_MODULE_1__.join is undefined`
 */

import { join } from 'path'

export const absolutePathRegex = /^(?:[a-z]+:)?\/\//

/**
 Matches:
 - ftp://
 - https://
 - //
 **/

export const isRelativePath = (str: string) => {
  if (absolutePathRegex.exec(str)) {
    return false
  }
  return true
}

export const getFullRelativePath = (...paths: string[]) => {
  if (isRelativePath(paths[paths.length - 1])) {
    return slash(join(...paths))
  }
  return paths[paths.length - 1]
}
