import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import createPreset from '@/preset'
describe('postcss plugin', () => {
  async function getCss (content: string[]) {
    const processor = postcss([
      tailwindcss({
        content: content.map((x) => {
          return {
            raw: x
          }
        }),
        plugins: [],
        presets: [
          createPreset({
            entryPoint: './test/fixtures/expose/expose.scss',
            files: {
              extendColors: {
                getVarName (str) {
                  return str.substring(8)
                }
              }
            }
          })
        ]
      })
    ])
    return await processor.process('@tailwind utilities;', {
      from: 'index.css',
      to: 'index.css'
    })
  }

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
})
