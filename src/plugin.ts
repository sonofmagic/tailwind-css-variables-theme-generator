import twPlugin from 'tailwindcss/plugin'
import { IGenerateOption } from './types'
import { generateSync } from './generate'
import defu from 'defu'
import { withOpacityValue, getKey } from './utils'
type AddBaseParams = Parameters<
  Parameters<Parameters<typeof twPlugin>['0']>['0']['addBase']
>['0']

// export function createPlugin (params: AddBaseParams) {
//   return twPlugin(({ addBase }) => {
//     addBase(params)
//   })
// }

type IWithOptions = typeof twPlugin.withOptions<IGenerateOption>

const withOptions: IWithOptions = (
  pluginFunction,
  configFunction = () => ({ content: [] })
) => {
  const optionsFunction = (options: IGenerateOption) => {
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
      write: false,
      withOpacityValue: true,
      injectBase: true
    }
    const generateResult = generateSync(defu(options, defaults))
    options.generateResult = generateResult
    return {
      __options: options,
      handler: pluginFunction(options),
      config: configFunction(options)
    }
  }
  optionsFunction.__isOptionsFunction = true as const
  // Expose plugin dependencies so that `object-hash` returns a different
  // value if anything here changes, to ensure a rebuild is triggered.
  optionsFunction.__pluginFunction = pluginFunction
  optionsFunction.__configFunction = configFunction
  return optionsFunction
}

export const createPlugin = withOptions(
  (options) => {
    const { generateResult } = options
    const mergedMap = generateResult!.mergedMap
    const params: AddBaseParams = [
      {
        ':root': mergedMap
      }
    ]
    return ({ addBase }) => {
      addBase(params)
    }
  },
  (options) => {
    const { generateResult } = options
    return {
      content: [],
      theme: {
        extend: {
          colors: generateResult!.meta.reduce<Record<string, any>>(
            (acc, cur) => {
              acc[cur.name] = withOpacityValue(cur.value)
              return acc
            },
            {}
          )
        }
      }
    }
  }
)
