import { exposeScssVariable, extractTheme } from '@/scss'
import { resolve } from 'path'
describe('scss expose', () => {
  it('default expose', () => {
    const mergedMap = extractTheme(
      exposeScssVariable(resolve(__dirname, './fixtures/expose/expose.scss'))
    )

    expect(mergedMap).toMatchSnapshot()
  })

  it('mutiple exposes', () => {
    const mergedMap = extractTheme(
      exposeScssVariable(resolve(__dirname, './fixtures/expose0/index.scss'))
    )

    expect(mergedMap).toMatchSnapshot()
  })
})
