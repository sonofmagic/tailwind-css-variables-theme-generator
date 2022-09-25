import { resolve, dirname } from 'path'
import { getOption } from './defaults'
import consola from 'consola'
import { cmkdir, renderTemplete, getAbsPath } from './utils'
import { exposeScssVariable, extractTheme } from './scss'
import type {
  IGenerateOption,
  IOutFileOption,
  FileEnumType,
  IGenerateResult
} from './types'

export function generateSync (option: IGenerateOption) {
  const opt = getOption(option)
  const fs = opt.outputFileSystem
  const { entryPoint, outdir, files, write } = opt
  const mergedMap = extractTheme(exposeScssVariable(entryPoint))
  const targetDir = dirname(entryPoint)
  const absOutdir = resolve(targetDir, outdir)

  const microtaskProducer: (() => any)[] = []
  const result: IGenerateResult = {
    js: {},
    scss: {},
    meta: [],
    mergedMap: {}
  }

  result.mergedMap = mergedMap

  const keys = Array.from(
    Object.values(mergedMap).reduce<Set<string>>((acc, cur) => {
      Object.keys(cur).forEach((k) => {
        acc.add(k)
      })
      return acc
    }, new Set())
  )
  const { getVarName, getVarValue } = opt.intelliSense
  result.meta = keys.map((x) => {
    return {
      name: getVarName?.(x) ?? x,
      value: getVarValue?.(x) ?? x
    }
  })
  write && cmkdir(absOutdir)
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
      microtaskProducer.push(() => {
        fs.writeFileSync(
          getAbsPath(outfile ?? resolve(absOutdir, 'variables.scss')),
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

    const extendColorsTemplete = renderTemplete(
      resolve(__dirname, `./t/js/${filename}`),
      {
        '/* {{placeholder}} */': jsResult
      }
    )
    if (write) {
      microtaskProducer.push(() => {
        fs.writeFileSync(
          getAbsPath(outfile ?? resolve(absOutdir, filename)),
          extendColorsTemplete
        )
        consola.success(`[${filename}] generate Successfully!`)
      })
    }
  }

  function handleScssFile (key: FileEnumType, filename: string) {
    const file = files[key]
    if (file !== false) {
      const src = resolve(__dirname, `./t/scss/${filename}`)
      const dest = resolve(absOutdir, filename)
      if (file === true) {
        if (write) {
          fs.copyFileSync(src, dest)
        }
      } else {
        const { replacement, outfile } = file as Required<IOutFileOption>
        const content = renderTemplete(src, replacement)
        if (write) {
          fs.writeFileSync(getAbsPath(outfile ?? dest), content, 'utf-8')
        }
      }

      write && consola.success(`[${filename}] generate Successfully!`)
    }
  }
  microtaskProducer.push(() => handleScssFile('util', 'util.scss'))
  microtaskProducer.push(() => handleScssFile('export', 'export.scss'))
  microtaskProducer.push(() => handleScssFile('root', 'root.scss'))

  microtaskProducer.map((fn) => fn())

  return result
}

export const generate = generateSync
