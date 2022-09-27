import less from 'less'
import type Less from 'less'
import fs from 'fs'

class LessExposeVariablePlugin implements Less.Plugin {
  minVersion?: [number, number, number] | undefined
  options: any
  constructor (options?: any) {
    this.options = options
    this.minVersion = [3, 5, 0]
  }

  install (instance: typeof less, pluginManager: Less.PluginManager) {
    // @ts-ignore
    //  console.log(instance.variable())
    pluginManager.addPreProcessor({
      process (src, extra) {
        return src
      }
    })
  }
}

export function exposeLessVariable (exposeFilePath: string, options?: any) {
  let result
  less.render(
    fs.readFileSync(exposeFilePath, 'utf-8'),
    {
      syncImport: true,
      plugins: [new LessExposeVariablePlugin()]
    },
    (err, output) => {
      if (err) {
        throw err
      }
      result = output
    }
  )

  return result
}
