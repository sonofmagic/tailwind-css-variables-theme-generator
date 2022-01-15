export function getKey (str: string) {
  return str
}

export function getJsValue (str: string) {
  return `withOpacityValue('${str}')`
}

export function getScssValue (str: string) {
  return `rgb(var(${str}))`
}
