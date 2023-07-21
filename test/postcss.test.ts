import { createGetCss } from './utils/index'
import { createPreset } from '@/preset'
import { createPlugin } from '@/plugin'
describe('postcss plugin', () => {
  const getCss = createGetCss(
    {
      content: [],
      plugins: [],
      presets: [
        createPreset({
          entryPoint: './test/fixtures/expose/expose.scss',
          files: {
            extendColors: {
              getVarName (str) {
                return str.slice(8)
              }
            }
          },
          intelliSense: {
            getVarName (str) {
              return str.slice(8)
            }
          }
        })
      ]
    },
    '@tailwind utilities;'
  )

  const getCssWithPlugin = createGetCss(
    {
      content: [],
      plugins: [
        createPlugin({
          entryPoint: './test/fixtures/expose0/index.scss',
          intelliSense: {
            getVarName (str) {
              return str.slice(8)
            }
          },
          injectSelector: 'page'
        })
      ],
      corePlugins: {
        preflight: false
      }
    },
    '@tailwind base;@tailwind utilities;'
  )

  it('base', async () => {
    const res = await getCss([
      `<div class="ring-white">
    <p>I have a white ring.</p>
</div>`
    ])
    expect(res.css.toString()).toMatchSnapshot()
  })

  it('custom color', async () => {
    const res = await getCss([
      `<div class="text-custom-text-color">
    <p class="bg-header-bg/70">I have a white ring.</p>
</div>`
    ])
    expect(res.css.toString()).toMatchSnapshot()
  })

  it('base plugin', async () => {
    const res = await getCssWithPlugin([
      `<div class="ring-white">
    <p>I have a white ring.</p>
</div>`
    ])
    expect(res.css.toString()).toMatchSnapshot()
  })

  it('custom color plugin', async () => {
    const res = await getCssWithPlugin([
      `<div class="text-custom-text-color">
    <p class="bg-canvas-default-transparent/70">I have a white ring.</p>
</div>`
    ])
    const css = res.css.toString()
    expect(css).toContain('.text-custom-text-color')
    expect(css).toContain('.bg-canvas-default-transparent\\/70')
    expect(css).toContain('page')
    expect(css).toMatchSnapshot()
  })
})
