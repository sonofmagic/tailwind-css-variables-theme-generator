import fsp from 'fs/promises'
import { resolve, dirname } from 'path'
import { getOption } from './defaults'
import consola from 'consola'
import { cmkdir, renderTemplete } from './utils'
import { exposeScssVariable } from './scss'
import type { IGenerateOption, IOutFileOption, FileEnumType } from './types'

export async function generate (option: IGenerateOption) {
  const opt = getOption(option)
  const { entryPoint, outdir, files } = opt
  const exposeAarry = exposeScssVariable(entryPoint)
  const targetDir = dirname(entryPoint)
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
  consola.info('[Output Dir]: ' + absOutdir)
  if (files.variables !== false) {
    const { getVarName, getVarValue, outfile } =
      files.variables as Required<IOutFileOption>
    // scss
    // ${{ removeColorPrefix(k) }}:{{ scssFilterShadow(k) }};
    const scssResult = keys
      .map((x) => {
        return `$${getVarName(x)}:${getVarValue(x)};`
      })
      .join('\n')
    await fsp.writeFile(
      outfile ?? resolve(absOutdir, 'variables.scss'),
      scssResult
    )
    consola.success('[variables.scss] generate Successfully!')
  }

  if (files.extendColors !== false) {
    // js:
    // '{{ removeColorPrefix(k) }}':{{ jsFilterShadow(k) }},
    const filename = 'extendColors.js'

    const { getVarName, getVarValue, outfile } =
      files.extendColors as Required<IOutFileOption>
    const jsResult = keys
      .map((x) => {
        return `'${getVarName(x)}': ${getVarValue(x)},`
      })
      .join('\n    ')

    const extendColorsTemplete = await renderTemplete(
      resolve(__dirname, `./t/js/${filename}`),
      {
        '/* {{placeholder}} */': jsResult
      }
    )
    await fsp.writeFile(
      outfile ?? resolve(absOutdir, filename),
      extendColorsTemplete
    )
    consola.success(`[${filename}] generate Successfully!`)
  }

  async function handleScssFile (key: FileEnumType, filename: string) {
    const file = files[key]
    if (file !== false) {
      const src = resolve(__dirname, `./t/scss/${filename}`)
      const dest = resolve(absOutdir, filename)
      if (file === true) {
        await fsp.copyFile(src, dest)
      } else {
        const { replacement, outfile } = file as Required<IOutFileOption>
        if (replacement) {
          const content = await renderTemplete(src, replacement)
          await fsp.writeFile(outfile ?? dest, content, 'utf-8')
        } else {
          await fsp.copyFile(src, outfile ?? dest)
        }
      }

      consola.success(`[${filename}] generate Successfully!`)
    }
  }

  await handleScssFile('util', 'util.scss')

  await handleScssFile('export', 'export.scss')

  await handleScssFile('root', 'root.scss')
}
