import fs from 'node:fs'
import path from 'node:path'
// import { color as d3Color } from 'd3-color'

export function cmkdir (dir: string) {
  const existed = fs.existsSync(dir)
  if (!existed) {
    fs.mkdirSync(dir, {
      recursive: true
    })
  }
}

export function getAbsPath (p: string) {
  return path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
}

export function renderTemplete (
  src: string,
  replacement?: Record<string, string>
) {
  let t = fs.readFileSync(src, 'utf8')
  if (replacement) {
    const replacements = Object.entries(replacement)
    for (const [key, value] of replacements) {
      t = t.replace(key, value)
    }
  }
  return t
}

export function withOpacityValue (variable: string) {
  return ({ opacityValue }: { opacityValue: string | number }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}) / ${opacityValue})`
  }
}

export function getKey (str: string) {
  return str
}
/**
 * @description remove css variables -- prefix
 */
export function removePrefix (name: string) {
  if (name.length > 2) {
    return name.slice(2)
  }
  return name
}

export function getJsValue (str: string) {
  return `withOpacityValue('${str}')`
}

export function getScssValue (str: string) {
  return `rgb(var(${str}))`
}

// export function parseColor (cssColorSpecifier:string) {
//   return d3Color(cssColorSpecifier)
// }
