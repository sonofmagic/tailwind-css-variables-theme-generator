import type { Value, SassColor, SassString } from 'sass'
import type { OrderedMap } from 'immutable'
import * as sass from 'sass'

// The asynchronous variants are much slower
export function exposeScssVariable (exposeFilePath: string) {
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
  return exposeAarry
}
