import defu from 'defu'
import type { IGenerateOption } from './types'
import fs from 'fs/promises'
import { getAbsPath } from './utils'

export function getKey (str: string) {
  return str
}

export function getJsValue (str: string) {
  return `withOpacityValue('${str}')`
}

export function getScssValue (str: string) {
  return `rgb(var(${str}))`
}

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
    sassOptions: {},
    outputFileSystem: fs,
    write: true
  }
}
