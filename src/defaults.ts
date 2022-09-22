import defu from 'defu'
import type { IGenerateOption } from './types'
import fs from 'fs'
import { getAbsPath, getJsValue, getKey, getScssValue } from './utils'

export function getOption (option: IGenerateOption): Required<IGenerateOption> {
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
        // filepath: '{{filepath}}',
        // variableName: '{{variableName}}'
      }
    },
    export: {
      replacement: {
        // filepath: '{{filepath}}',
        // variableName: '{{variableName}}'
      }
    },
    util: true
  }

  return {
    entryPoint: getAbsPath(option.entryPoint),
    outdir: option.outdir ?? '.',
    files: defu(option.files!, filesDefault),
    sassOptions: option.sassOptions ?? {},
    outputFileSystem: option.outputFileSystem ?? fs,
    write: Boolean(option.write ?? true)
  }
}
