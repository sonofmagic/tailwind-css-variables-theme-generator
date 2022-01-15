
const { generate } = require('../../')
const path = require('path')
  ; (async () => {
  await generate({
    entryPoint: path.resolve(__dirname, './expose/expose.scss'),
    outdir: 'expose',
    files: {
      extendColors: {
        getVarName (str) {
          return str.substring(8)
        },
        getVarValue (str) {
          if (str.includes('shadow')) {
            return `'${str}'`
          }
          return `withOpacityValue('${str}')`
        }
      },
      variables: {
        getVarName (str) {
          return str.substring(8)
        }
      },
      export: {
        replacement: {
          '{{filepath}}': '../constants.scss',
          '{{variableName}}': '$root-vars'
        }
      },
      root: {
        replacement: {
          '{{filepath}}': '../constants.scss',
          '{{variableName}}': '$root-vars'
        }
      },
      util: true
    }
  })
})()
