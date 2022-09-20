import postcss from 'postcss'
import tailwindcss from 'tailwindcss'

describe('postcss plugin', () => {
  async function getCss (content: string[]) {
    const processor = postcss([
      tailwindcss({
        content: content.map((x) => {
          return {
            raw: x
          }
        }),
        plugins: []
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
})
