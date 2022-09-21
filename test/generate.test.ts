import { generate } from '@/generate'
import { resolve } from 'path'

const fixturesDir = resolve(__dirname, './fixtures')
describe('generate', () => {
  it('default generate', async () => {
    const res = await generate({
      entryPoint: resolve(fixturesDir, './expose/expose.scss'),
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
          },
          outfile: resolve(fixturesDir, 'extendColors.js')
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
      },
      sassOptions: {
        // ...
      }
    })
    expect(res).toMatchSnapshot()
  })

  it('relative path', async () => {
    const res = await generate({
      entryPoint: './test/fixtures/expose0/index.scss',
      outdir: 'expose',
      files: {
        extendColors: {
          getVarName (str) {
            return str.substring(8)
          }
        },
        variables: {
          getVarName (str) {
            return str.substring(8)
          }
        },
        export: true,
        root: true,
        util: true
      },
      sassOptions: {
        // ...
      }
    })
    expect(res).toMatchSnapshot()
  })
})
