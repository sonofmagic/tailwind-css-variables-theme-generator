import type { Options } from 'sass'
import type fsp from 'fs/promises'
export interface IOutFileOption {
  getVarName?: (key: string) => string
  getVarValue?: (key: string) => string
  // replacements
  replacement?: Record<string, string>
  // override default filepath
  outfile?: string
}

export interface OutputFileSystem {
  copyFile: typeof fsp.copyFile
  writeFile: typeof fsp.writeFile
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
}

export type FileEnumType =
  | 'extendColors'
  | 'variables'
  | 'root'
  | 'export'
  | 'util'
