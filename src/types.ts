import type { Options } from 'sass'
import type fs from 'fs'
export interface IOutFileOption {
  getVarName?: (key: string) => string
  getVarValue?: (key: string) => string
  // replacements
  replacement?: Record<string, string>
  // override default filepath
  outfile?: string
}

export interface OutputFileSystem {
  copyFileSync: typeof fs.copyFileSync
  writeFileSync: typeof fs.writeFileSync
}
export interface IGenerateOption {
  entryPoint: string
  outdir?: string
  files?: {
    extendColors?: IOutFileOption | boolean
    variables?: IOutFileOption | boolean
    root?: IOutFileOption | boolean
    util?: IOutFileOption | boolean
    export?: IOutFileOption | boolean
  }
  sassOptions?: Options<'sync'>
  outputFileSystem?: OutputFileSystem
  write?: boolean
  intelliSense?: {
    getVarName?: (key: string) => string
    getVarValue?: (key: string) => string
  }
}

export type FileEnumType =
  | 'extendColors'
  | 'variables'
  | 'root'
  | 'export'
  | 'util'
