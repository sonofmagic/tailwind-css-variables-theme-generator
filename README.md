# tailwind-css-variables-theme-generator

[思路来源](https://www.icebreaker.top/articles/2021/12/18-flexible-theme)

生成文件来构建动态的主题色

自动生成 `tailwindcss v3` 智能提示

## Usage

```scss
// ./expose/expose.scss
@use './constants.scss' as C;
// sass:map
$expose: expose(C.$root-vars);
```


```js

const { generate } = require('tailwind-css-variables-theme-generator')
const path = require('path')
  ; (async () => {
  await generate({
    // entryPoint
    entryPoint: path.resolve(__dirname, './expose/expose.scss'),
    // default '.'
    outdir: 'expose',
    // output file
    files: {
      // extendColors.js for tailwindcss v3
      extendColors: {
        getVarName (str) {
          return str.substring(8)
        },
        getVarValue (str) {
          if (str.includes('shadow')) {
            return `'${str}'`
          }
          return `withOpacityValue('${str}')`
        }
      },
      // variables.scss for global scss variables
      variables: {
        getVarName (str) {
          return str.substring(8)
        }
      },
      // object | true | undefined -> generate this file
      // false -> not generate this file
      export: {
        replacement: {
          '{{filepath}}': '../constants.scss',
          '{{variableName}}': '$root-vars'
        }
      },
      // replacement : Record<string,string>
      root: {
        replacement: {
          '{{filepath}}': '../constants.scss',
          '{{variableName}}': '$root-vars'
        }
      },
      // boolean: false -> not generate this file
      util: true
    }
  })
})()

```