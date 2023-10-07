/**
 * Concatenates class names into a single string.
 * Only truthy values are included in the resulting string.
 * This utility function is useful when applying conditional class names.
 *
 * @function
 * @param {...string} classes - A list of class names to be concatenated.
 * @returns {string} - A string containing all the truthy class names, separated by a space.
 * @example
 * classNames('class1', 'class2', !condition && 'class3') // returns 'class1 class2' if condition is falsy
 */
export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Copies the provided URL to the clipboard.
 * It creates the URL by combining the `window.location.origin` with the `asPath` parameter.
 *
 * @function
 * @async
 * @param {string} asPath - The path of the current route.
 * @throws Will not throw an error but fails silently if an error occurs during copy to clipboard.
 * @example
 * copyCurrentURLToClipboard('/some/path')
 */
export const copyCurrentURLToClipboard = async (asPath: string) => {
  try {
    const url = window.location.origin + asPath
    await navigator.clipboard.writeText(url)
  } catch (error) {}
}

/**
 * Converts any given string to a slug
 *
 * @param {string} str - The string to be converted to a slug
 * @returns {string} - The converted slug string
 */
export const sluggify = (str: string): string => {
  if (typeof str !== 'string') throw new Error('A string input is required')
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '')
}
