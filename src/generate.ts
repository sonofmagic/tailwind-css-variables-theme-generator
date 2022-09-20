import { resolve, dirname } from 'path'
import { getOption } from './defaults'
import consola from 'consola'
import { cmkdir, renderTemplete } from './utils'
import { exposeScssVariable } from './scss'
import type { IGenerateOption, IOutFileOption, FileEnumType } from './types'

export async function generate (option: IGenerateOption) {
  const opt = getOption(option)
  const fsp = opt.outputFileSystem
  const { entryPoint, outdir, files, write } = opt
  const exposeAarry = exposeScssVariable(entryPoint)
  const targetDir = dirname(entryPoint)
  const absOutdir = resolve(targetDir, outdir)
  const mergedMap: Record<string, string> = {}
  const microtaskProducer: (() => Promise<any>)[] = []
  const result: {
    scss: {
      variables?: string
      // util?: string
      // export?: string
      // root?: string
    }
    js: {
      extendColors?: string
    }
  } = {
    js: {},
    scss: {}
  }

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
    result.scss.variables = scssResult
    if (write) {
      microtaskProducer.push(async () => {
        await fsp.writeFile(
          outfile ?? resolve(absOutdir, 'variables.scss'),
          scssResult
        )
        consola.success('[variables.scss] generate Successfully!')
      })
    }
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
    result.js.extendColors = jsResult
    const extendColorsTemplete = await renderTemplete(
      resolve(__dirname, `./t/js/${filename}`),
      {
        '/* {{placeholder}} */': jsResult
      }
    )
    if (write) {
      microtaskProducer.push(async () => {
        await fsp.writeFile(
          outfile ?? resolve(absOutdir, filename),
          extendColorsTemplete
        )
        consola.success(`[${filename}] generate Successfully!`)
      })
    }
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
  microtaskProducer.push(() => handleScssFile('util', 'util.scss'))
  microtaskProducer.push(() => handleScssFile('export', 'export.scss'))
  microtaskProducer.push(() => handleScssFile('root', 'root.scss'))

  await Promise.all(microtaskProducer.map((fn) => fn()))

  return result
}
