import { createPlugin } from '@/plugin'
import { createGetCss } from './utils/index'
describe('index', () => {
  const getCssWithPlugin = createGetCss(
    {
      content: [],
      plugins: [
        createPlugin({
          entryPoint: './test/fixtures/expose0/index.scss'
        })
      ],
      corePlugins: {
        preflight: false
      }
    },
    '@tailwind base;@tailwind utilities;'
  )

  it('common color plugin', async () => {
    const res = await getCssWithPlugin([
      `<div class="text-color-custom-text-color">
    <p class="bg-color-canvas-default-transparent/70">1</p>
</div>`
    ])
    const css = res.css.toString()
    expect(css).toContain('.text-color-custom-text-color')
    expect(css).toContain('.bg-color-canvas-default-transparent\\/70')
    expect(css).toMatchSnapshot()
  })
})
