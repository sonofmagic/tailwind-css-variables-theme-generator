import postcss from 'postcss'
import tailwindcss, { Config } from 'tailwindcss'

export function createGetCss (
  config: Config,
  css: string = '@tailwind base;@tailwind components;@tailwind utilities;'
) {
  return function (content: string[]) {
    config.content = content.map((x) => {
      return {
        raw: x
      }
    })
    const processor = postcss([tailwindcss(config)])
    return processor.process(css, {
      from: 'index.css',
      to: 'index.css'
    })
  }
}
