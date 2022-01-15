import fsp from 'fs/promises'
import path from 'path'
import defu from 'defu'
import { getJsValue, getKey, getScssValue } from './defaults'
import consola from 'consola'
import { cmkdir } from './utils'
import { exposeScssVariable } from './scss'
import type { IGenerateOption, IOutFileOption } from './types'
const resolve = path.resolve

function getOption (option: IGenerateOption): Required<IGenerateOption> {
  const filesDefault: IGenerateOption['files'] = {
    extendColors: {
      getVarName: getKey,
      getVarValue: getJsValue
    },
    variables: {
      getVarName: getKey,
      getVarValue: getScssValue
    },
    root: {
      replacement: {
        filepath: '{{filepath}}',
        variableName: '{{variableName}}'
      }
    },
    export: {
      replacement: {
        filepath: '{{filepath}}',
        variableName: '{{variableName}}'
      }
    },
    util: true
  }
  return {
    entryPoint: option.entryPoint,
    outdir: option.outdir ?? '.',
    files: defu(option.files!, filesDefault)
  }
}

// function renderTemplete () {}

// function generateTemplete () {}

export async function generate (option: IGenerateOption) {
  const opt = getOption(option)
  const { entryPoint, outdir, files } = opt
  const exposeAarry = exposeScssVariable(entryPoint)
  const targetDir = path.dirname(entryPoint)
  const absOutdir = resolve(targetDir, outdir)
  const mergedMap: Record<string, string> = {}
  for (let i = 0; i < exposeAarry.length; i++) {
    const map = exposeAarry[i]
    for (const [key, color] of map) {
      mergedMap[key.text] = `${color.red} ${color.green} ${color.blue}` // ${color.alpha}
    }
  }

  const keys = Object.keys(mergedMap)

  await cmkdir(absOutdir)

  if (files.variables !== false) {
    const { getVarName, getVarValue } =
      files.variables as Required<IOutFileOption>
    // scss
    // ${{ removeColorPrefix(k) }}:{{ scssFilterShadow(k) }};
    const scssResult = keys
      .map((x) => {
        return `$${getVarName(x)}:${getVarValue(x)};`
      })
      .join('\n')
    await fsp.writeFile(resolve(absOutdir, 'variables.scss'), scssResult)
    consola.success('[variables.scss] generate Successfully!')
  }

  if (files.extendColors !== false) {
    // js:
    // '{{ removeColorPrefix(k) }}':{{ jsFilterShadow(k) }},
    const placeholder = '/* {{placeholder}} */'
    const extendColorsTemplete = await fsp.readFile(
      resolve(__dirname, './t/js/extendColors.js'),
      'utf-8'
    )
    const { getVarName, getVarValue } =
      files.extendColors as Required<IOutFileOption>
    const jsResult = keys
      .map((x) => {
        return `'${getVarName(x)}':${getVarValue(x)},`
      })
      .join('\n  ')
    await fsp.writeFile(
      resolve(absOutdir, 'extendColors.js'),
      extendColorsTemplete.replace(placeholder, jsResult)
    )
    consola.success('[extendColors.js] generate Successfully!')
  }

  if (files.util !== false) {
    await fsp.copyFile(
      resolve(__dirname, './t/scss/util.scss'),
      resolve(absOutdir, 'util.scss')
    )
    consola.success('[util.scss] generate Successfully!')
  }

  if (files.export !== false) {
    await fsp.copyFile(
      resolve(__dirname, './t/scss/export.scss'),
      resolve(absOutdir, 'export.scss')
    )
    consola.success('[export.scss] generate Successfully!')
  }

  if (files.root !== false) {
    await fsp.copyFile(
      resolve(__dirname, './t/scss/root.scss'),
      resolve(absOutdir, 'root.scss')
    )
    consola.success('[root.scss] generate Successfully!')
  }
}
