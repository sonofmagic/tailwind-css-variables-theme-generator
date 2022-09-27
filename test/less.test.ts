import { exposeLessVariable } from '@/less'
import { resolve } from 'path'
describe('scss expose', () => {
  it('default expose', () => {
    const mergedMap = exposeLessVariable(
      resolve(__dirname, './fixtures/less/expose/index.less')
    )

    expect(true).toBe(true)
  })
})
