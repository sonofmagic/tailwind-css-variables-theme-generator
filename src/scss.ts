import type { Value, SassColor, SassString, Options } from 'sass'
import type { OrderedMap } from 'immutable'
import * as sass from 'sass'
import defu from 'defu'
// The asynchronous variants are much slower
export function exposeScssVariable (
  exposeFilePath: string,
  options?: Options<'sync'>
) {
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
