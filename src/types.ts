export interface IOutFileOption {
  getVarName?: (key: string) => string
  getVarValue?: (key: string) => string
  replacement?: Record<string, string>
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
