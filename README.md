# tailwind-css-variables-theme-generator

> generate files for tailwindcss to build a dynamic web theme

[principle->cn 原理](https://www.icebreaker.top/articles/2021/12/18-flexible-theme)

## Features

1. tailwindcss v3 intellisense
2. global scss variables by additionalData
3. sass util for color group preset or fetch theme data from backend

总结: 生成文件来构建动态的主题色,自动生成 `tailwindcss v3` 智能提示

## Usage

1. create a sass:map:

```scss
// constants.scss
$root-vars: (
  --color-canvas-default-transparent: rgba(34, 39, 46, 0),
  --color-marketing-icon-primary: #6cb6ff,
  ....
)
```

2. expose this sass:map -> js

```scss
// ./expose/expose.scss
@use './constants.scss' as C;
// sass:map
$expose: expose(C.$root-vars);
```
Then

### Basic Usage

```js
const { generate } = require('tailwind-css-variables-theme-generator')
const path = require('path')

;(async () => {
  await generate({
    entryPoint: path.resolve(__dirname, './expose/expose.scss')
  })
})()
```

### Full Options Usage

```js
const { generate } = require('tailwind-css-variables-theme-generator')
const path = require('path')

;(async () => {
  await generate({
    // entryPoint
    entryPoint: path.resolve(__dirname, './expose/expose.scss'),
    // default '.'
    outdir: 'expose',
    // output file
    files: {
      // extendColors.js for tailwindcss v3
      extendColors: {
        getVarName(str) {
          return str.substring(8)
        },
        getVarValue(str) {
          if (str.includes('shadow')) {
            return `'${str}'`
          }
          return `withOpacityValue('${str}')`
        },
        // override default filepath
        outfile: path.resolve(__dirname, 'extendColors.js')
      },
      // variables.scss for global scss variables
      variables: {
        getVarName(str) {
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
    },
    sassOptions: {
      // ...
    }
  })
})()
```

## Options
### entryPoint (required)

entryPoint should be a scss file and you shall expose your map

```scss
@use './constants.scss' as C;

$other-vars: (
  // same name : override constants map ↑
  --color-canvas-default-transparent: rgba(32, 54, 85, 0),
  --color-marketing-icon-primary: #053c74,
  --color-custom-text-color: #546821
);

$expose: expose(C.$root-vars);
$expose1: expose($other-vars);

```

**`expose`** is a [`CustomFunction`](https://sass-lang.com/documentation/js-api/modules#CustomFunction) defined by **`This package`** to expose data to javascript

### outdir (default '.')

output dir

### files

control each output file

### sassOptions (sass.Options<'sync'>)

## Output Files

### extendColors.js

1. imported by tailwind.config.js

```js
// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const extendColors = require('./client/theme/extendColors.js')

/** @type {import('@types/tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  //...
  theme: {
    extend: {
      ...extendColors.colors,
    },
    // remove default colors
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
    }
  }
}
```

2. then you can write these code:

```scss
h1{
  @apply text-header-text; 
  // eq
  // color: rgb(var(--color-header-text))
}
h2{
  @apply text-header-text/70;
  // eq
  // color: rgb(var(--color-header-text) / 0.7)
}
```
or 

```html
<div class="text-header-text/70">Hello world</div>
```

### variables.scss

1. add to sass-loader option

```js
// webpack sass-loader option
loaders:{
  scss: {
    additionalData: '@use "@/assets/scss/variables.scss" as *;',
    sassOptions: {
      quietDeps: true,
    }
  }
}
```


### root.scss | export.scss | util.scss

- root.scss for html default css variables
- export.scss for webpack sass-loader
- util.scss for rgb / rgba string

## Live Demo

[Demo](https://www.icebreaker.top/)