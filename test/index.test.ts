import { generate } from '../'
import path from 'path'

describe('Main', () => {
  it('default', async () => {
    await generate(path.resolve(__dirname, './fixtures/expose/expose.scss'))
  })
})
