import type { Value, SassColor, SassString, Options, compile } from 'sass'
import type { OrderedMap } from 'immutable'
import consola from 'consola'

import defu from 'defu'
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

  const exposeAarry: OrderedMap<SassString, SassColor>[] = []
  const defaultOption: Options<'sync'> = {
    functions: {
      'expose($map)': (args: Value[]) => {
        const value = args[0].assertMap('map')
        const map = value.contents as OrderedMap<SassString, SassColor>
        exposeAarry.push(map)
        return value
      }
    }
  }

  sass.compile(exposeFilePath, defu(options!, defaultOption))
  return exposeAarry
}

export function extractColorStringMap (
  exposeAarry: ReturnType<typeof exposeScssVariable>
) {
  const mergedMap: Record<string, string> = {}
  for (let i = 0; i < exposeAarry.length; i++) {
    const map = exposeAarry[i]
    for (const [key, color] of map) {
      mergedMap[key.text] = `${color.red} ${color.green} ${color.blue}` // ${color.alpha}
    }
  }
  return mergedMap
}
