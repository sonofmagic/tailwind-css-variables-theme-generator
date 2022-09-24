import type { Value, SassColor, SassString, Options, compile } from 'sass'
import type { OrderedMap } from 'immutable'
import consola from 'consola'
import { MergedMapPlaceholder } from '@/constants'
import defu from 'defu'
import { IExposeItem } from '@/types'

// The asynchronous variants are much slower
export function exposeScssVariable (
  exposeFilePath: string,
  options?: Options<'sync'>
) {
  let sass: { compile: typeof compile }
  try {
    sass = require('sass')
  } catch (error) {
    consola.error(
      'Please install sass ! run `npm i -D sass` or `yarn add -D sass` and try again.'
    )
    throw error
  }

  const exposeAarry: IExposeItem[] = []
  const defaultOption: Options<'sync'> = {
    functions: {
      'expose($map)': (args: Value[]) => {
        const value = args[0].assertMap('map')
        const map = value.contents as OrderedMap<SassString, SassColor>
        exposeAarry.push({
          map
        })
        return value
      },
      'expose-with-selector($map,$selector)': (args: Value[]) => {
        const value = args[0].assertMap('map')
        const selector = args[1].assertString('selector')
        const map = value.contents as OrderedMap<SassString, SassColor>

        exposeAarry.push({
          selector: selector.text,
          map
        })
        return value
      }
    }
  }

  sass.compile(exposeFilePath, defu(options!, defaultOption))
  return exposeAarry
}

export function extractTheme (
  exposeAarry: ReturnType<typeof exposeScssVariable>
) {
  const mergedMap: Record<string, Record<string, string>> = {}
  for (let i = 0; i < exposeAarry.length; i++) {
    const item = exposeAarry[i]
    for (const [key, color] of item.map) {
      const selector = item.selector ?? MergedMapPlaceholder
      if (mergedMap[selector]) {
        mergedMap[selector][
          key.text
        ] = `${color.red} ${color.green} ${color.blue}` // ${color.alpha}
      } else {
        mergedMap[selector] = {
          [key.text]: `${color.red} ${color.green} ${color.blue}`
        }
      }
    }
  }
  return mergedMap
}
