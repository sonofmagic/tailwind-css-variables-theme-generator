import fsp from 'fs/promises'
import path from 'path'
import type { Value, SassColor, SassString } from 'sass'
import type { OrderedMap } from 'immutable'
import * as sass from 'sass'

function getKey (str: string) {
  return str
}

function jsFilter (str: string) {
  return `withOpacityValue('${str}')`
}

function scssFilter (str: string) {
  return `rgb(var(${str}))`
}

// The asynchronous variants are much slower

export async function generate (exposeFilePath: string) {
  const exposeAarry: OrderedMap<SassString, SassColor>[] = []
  sass.compile(exposeFilePath, {
    functions: {
      'expose($map)': (args: Value[]) => {
        const value = args[0].assertMap('map')
        const map = value.contents as OrderedMap<SassString, SassColor>
        exposeAarry.push(map)
        return value
      }
    }
  })
  const mergedMap: Record<string, string> = {}
  for (let i = 0; i < exposeAarry.length; i++) {
    const map = exposeAarry[i]
    for (const [key, color] of map) {
      mergedMap[key.text] = `${color.red} ${color.green} ${color.blue}` // ${color.alpha}
    }
  }

  const keys = Object.keys(mergedMap)

  const getScssVarName = getKey
  const getScssVarValue = scssFilter
  // scss
  // ${{ removeColorPrefix(k) }}:{{ scssFilterShadow(k) }};
  const scssResult = keys
    .map((x) => {
      return `$${getScssVarName(x)}:${getScssVarValue(x)};`
    })
    .join('\n')
  const targetDir = path.dirname(exposeFilePath)
  await fsp.writeFile(path.resolve(targetDir, 'variables.scss'), scssResult)

  // js:
  // '{{ removeColorPrefix(k) }}':{{ jsFilterShadow(k) }},
  const placeholder = '/* {{placeholder}} */'

  const extendColorsTemplete = fsp.readFile(
    path.resolve(__dirname, './t/js/extendColors.js'),
    'utf-8'
  )
  const getJsVarName = getKey
  const getJsVarValue = jsFilter
  const jsResult = keys
    .map((x) => {
      return `'${getJsVarName(x)}':${getJsVarValue(x)},`
    })
    .join('\n')

  await fsp.writeFile(
    path.resolve(targetDir, 'extendColors.js'),
    (await extendColorsTemplete).replace(placeholder, jsResult)
  )

  await fsp.copyFile(
    path.resolve(__dirname, './t/scss/util.scss'),
    path.resolve(targetDir, 'util.scss')
  )
  await fsp.copyFile(
    path.resolve(__dirname, './t/scss/root.scss'),
    path.resolve(targetDir, 'root.scss')
  )
  await fsp.copyFile(
    path.resolve(__dirname, './t/scss/export.scss'),
    path.resolve(targetDir, 'export.scss')
  )
}
