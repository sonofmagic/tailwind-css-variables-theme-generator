export interface IOutFileOption {
  getVarName?: (key: string) => string
  getVarValue?: (key: string) => string
  // replacements
  replacement?: Record<string, string>
  // override default filepath
  outfile?: string
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
}

export type FileEnumType =
  | 'extendColors'
  | 'variables'
  | 'root'
  | 'export'
  | 'util'
