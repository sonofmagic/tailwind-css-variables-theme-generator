import { exposeScssVariable } from '@/scss'
import { resolve } from 'path'
describe('scss expose', () => {
  it('default expose', async () => {
    const exposeAarry = await exposeScssVariable(
      resolve(__dirname, './fixtures/expose/expose.scss')
    )
    const mergedMap: Record<string, string> = {}
    for (let i = 0; i < exposeAarry.length; i++) {
      const map = exposeAarry[i]
      for (const [key, color] of map) {
        mergedMap[key.text] = `${color.red ?? 0} ${color.green ?? 0} ${
          color.blue ?? 0
        }` // ${color.alpha}
      }
    }
    expect(mergedMap).toMatchSnapshot()
  })
})
