import type fs from 'node:fs'
import type { Options, SassColor, SassString } from 'sass'
import type { OrderedMap } from 'immutable'
export interface IExposeItem {
  selector?: string
  map: OrderedMap<SassString, SassColor>
}

export interface IOutFileOption {
  getVarName?: (key: string) => string
  getVarValue?: (key: string) => string
  // replacements
  replacement?: {
    '{{filepath}}'?: string
    '{{variableName}}'?: string
  } & Record<string, string>
  // override default filepath
  outfile?: string
}

export interface IGenerateResult {
  scss: {
    variables?: string
    // util?: string
    // export?: string
    // root?: string
  }
  js: {
    extendColors?: string
  }
  meta: { name: string; value: string }[]
  mergedMap: Record<string, Record<string, string>>
}

export type IUtilOutFileOption =
  | Pick<IOutFileOption, 'replacement' | 'outfile'>
  | boolean

export type IMainOutFileOption =
  | Pick<IOutFileOption, 'getVarName' | 'getVarValue' | 'outfile'>
  | boolean

export interface OutputFileSystem {
  copyFileSync: typeof fs.copyFileSync
  writeFileSync: typeof fs.writeFileSync
}
export interface IGenerateOption {
  entryPoint: string
  outdir?: string
  files?: {
    extendColors?: IMainOutFileOption
    variables?: IMainOutFileOption
    root?: IUtilOutFileOption
    util?: IUtilOutFileOption
    export?: IUtilOutFileOption
  }
  sassOptions?: Options<'sync'>
  outputFileSystem?: OutputFileSystem
  write?: boolean
  intelliSense?: {
    getVarName?: (key: string) => string
    getVarValue?: (key: string) => string
  }
  withOpacityValue?: boolean
  injectBase?: boolean
  injectSelector?: string
  generateResult?: IGenerateResult
}

export type FileEnumType =
  | 'extendColors'
  | 'variables'
  | 'root'
  | 'export'
  | 'util'
