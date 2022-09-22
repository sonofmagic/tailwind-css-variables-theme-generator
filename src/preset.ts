import type { Config } from 'tailwindcss'
import { IGenerateOption } from './types'
import { generateSync } from './generate'
import defu from 'defu'
import { withOpacityValue, getKey } from './utils'

export function createPreset (options: IGenerateOption): Config {
  const defaults: Partial<IGenerateOption> = {
    files: {
      root: false,
      util: false,
      variables: false,
      export: false,
      extendColors: {
        getVarName: getKey,
        getVarValue: getKey
      }
    },
    write: false
  }
  const { meta } = generateSync(defu(options, defaults))
  return {
    content: [],
    theme: {
      extend: {
        colors: meta.reduce<Record<string, any>>((acc, cur) => {
          acc[cur.name] = withOpacityValue(cur.value)
          return acc
        }, {})
      }
    }
  }
}
