import { generateSync } from '@/generate'
import { resolve } from 'path'
import { existsSync } from 'fs'
import del from 'del'

const fixturesDir = resolve(__dirname, './fixtures')
describe('generate', () => {
  it('default generate', async () => {
    const filePaths = [
      resolve(fixturesDir, './extendColors.js'),
      resolve(fixturesDir, './expose/expose/export.scss'),
      resolve(fixturesDir, './expose/expose/root.scss'),
      resolve(fixturesDir, './expose/expose/util.scss'),
      resolve(fixturesDir, './expose/expose/variables.scss')
    ]
    del.sync(filePaths)

    const res = generateSync({
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
    filePaths.forEach((filePath) => {
      expect(existsSync(filePath)).toBe(true)
    })
  })

  it('relative path', () => {
    const res = generateSync({
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
