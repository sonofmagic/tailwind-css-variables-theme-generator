# tailwind-css-variables-theme-generator

> generate files for tailwindcss to build a dynamic web theme

[principle zh-cn](https://www.icebreaker.top/articles/2021/12/18-flexible-theme)

## Features

1. tailwindcss v3 intellisense
2. global scss variables by additionalData
3. sass util for color group preset or fetch theme data from backend

## Usage

### Install

```bash
npm i -D tailwind-css-variables-theme-generator sass
# or
yarn add -D tailwind-css-variables-theme-generator sass
```

### Prepare expose.scss

1. create a sass:map:

```scss
// constants.scss
$root-vars: (
  --color-canvas-default-transparent: rgba(32, 54, 85, 0),
  --color-marketing-icon-primary: #053c74,
  --color-custom-text-color: #546821
);
// a other style
$root-style1-vars: (
  --color-canvas-default-transparent: rgba(21, 89, 184, 0),
  --color-marketing-icon-primary: #0b121a,
  --color-custom-text-color: #43463e
);
// another style
$root-style2-vars: (
  --color-canvas-default-transparent: rgba(89, 101, 117, 0),
  --color-marketing-icon-primary: #003879,
  --color-custom-text-color: #314215,
);
```

1. expose `sass:map` and extract value to js

```scss
// ./expose/expose.scss
@use './constants.scss' as C;
// sass:map
// same as expose-with-selector(C.$root-style1-vars, ":root")
$style0: expose(C.$root-vars); 
$style1: expose-with-selector(C.$root-style1-vars, "[data-color-mode='light']");
$style2: expose-with-selector(C.$root-style2-vars, "[data-color-mode='dark']");
```

### Tailwindcss Plugin Usage

```js
const { createPlugin } = require('tailwind-css-variables-theme-generator')

/** @type {import('tailwindcss').Config} */
module.exports = {
  // ...
  plugins: [
    createPlugin({
      entryPoint: 'path/to/expose.scss'
    })
  ],
}

```

This Plugin will modify `theme.extend.colors` and do `addBase`.

Then you can write follow code in your html:

```html
<div class="text-color-custom-text-color">
    <p class="bg-color-canvas-default-transparent/70">1</p>
</div>
```

It will generate css:

```css
:root {--color-canvas-default-transparent: 32 54 85;--color-marketing-icon-primary: 5 60 116;--color-custom-text-color: 84 104 33
}
[data-color-mode='light'] {--color-canvas-default-transparent: 21 89 184;--color-marketing-icon-primary: 11 18 26;--color-custom-text-color: 67 70 62
}
[data-color-mode='dark'] {--color-canvas-default-transparent: 89 101 117;--color-marketing-icon-primary: 0 56 121;--color-custom-text-color: 49 66 21
}
*, ::before, ::after {--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x:  ;--tw-pan-y:  ;--tw-pinch-zoom:  ;--tw-scroll-snap-strictness: proximity;--tw-ordinal:  ;--tw-slashed-zero:  ;--tw-numeric-figure:  ;--tw-numeric-spacing:  ;--tw-numeric-fraction:  ;--tw-ring-inset:  ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / 0.5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur:  ;--tw-brightness:  ;--tw-contrast:  ;--tw-grayscale:  ;--tw-hue-rotate:  ;--tw-invert:  ;--tw-saturate:  ;--tw-sepia:  ;--tw-drop-shadow:  ;--tw-backdrop-blur:  ;--tw-backdrop-brightness:  ;--tw-backdrop-contrast:  ;--tw-backdrop-grayscale:  ;--tw-backdrop-hue-rotate:  ;--tw-backdrop-invert:  ;--tw-backdrop-opacity:  ;--tw-backdrop-saturate:  ;--tw-backdrop-sepia:  
}
::backdrop {--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x:  ;--tw-pan-y:  ;--tw-pinch-zoom:  ;--tw-scroll-snap-strictness: proximity;--tw-ordinal:  ;--tw-slashed-zero:  ;--tw-numeric-figure:  ;--tw-numeric-spacing:  ;--tw-numeric-fraction:  ;--tw-ring-inset:  ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / 0.5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur:  ;--tw-brightness:  ;--tw-contrast:  ;--tw-grayscale:  ;--tw-hue-rotate:  ;--tw-invert:  ;--tw-saturate:  ;--tw-sepia:  ;--tw-drop-shadow:  ;--tw-backdrop-blur:  ;--tw-backdrop-brightness:  ;--tw-backdrop-contrast:  ;--tw-backdrop-grayscale:  ;--tw-backdrop-hue-rotate:  ;--tw-backdrop-invert:  ;--tw-backdrop-opacity:  ;--tw-backdrop-saturate:  ;--tw-backdrop-sepia:  
}
.bg-color-canvas-default-transparent\\/70 {background-color: rgb(var(--color-canvas-default-transparent) / 0.7)
}
.text-color-custom-text-color {--tw-text-opacity: 1;color: rgb(var(--color-custom-text-color) / var(--tw-text-opacity))
}
```

If you want to customize tailwindcss utilities css

```js
createPlugin({
  entryPoint: 'path/to/expose.scss',
  intelliSense: {
    // formatter var name
    getVarName (str) {
      return str.substring(8)
    },
    // getVarValue (str){
    //   return str
    // }
  },
  // use `page` selector replace `:root`
  // injectSelector: 'page'
})
```

Then write follow html: (remove `-color-`)

```html
<div class="text-custom-text-color">
    <p class="bg-canvas-default-transparent/70">1</p>
</div>
```

### Script Usage

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

Copy [github](https://github.com/) Theme and apply it to your application.

1. copy all css var to `sass:map` (`:root`, `[data-color-mode]`,`[data-light-theme]`,`[data-dark-theme]`), you can copy all variables from chrome devtools quickly,and replace all `;` to `,` to transform to `sass:map`.

2. prepare following config:

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
        }
        // override default filepath
        // outfile: path.resolve(__dirname, 'extendColors.js')
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

3. apply the outputs to your **global** stylesheet and `tailwind.config.js`

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

- getVarName:`(str:string)=>string`: generate map key function
- getVarValue:`(str:string)=>string`: generate map value function
- replacement: `Record<string,string>`: replace template variables
- outfile: `string`: an abs path, this is a highest priority which will override default outpath.

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
      ...extendColors.colors
    },
    // remove default colors
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray
    }
  }
}
```

2. then you can write these code:

```scss
h1 {
  @apply text-header-text;
  // eq color: rgb(var(--color-header-text))
}
h2 {
  @apply text-header-text/70;
  // eq color: rgb(var(--color-header-text) / 0.7)
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

## Theme Toggle

```scss
:root {
  @each $var, $color in C.$root-vars {
    #{$var}: Util.getRgbString($color);
  }
}

[data-color-mode='light'] {
  @each $var, $color in Light.$light-vars {
    #{$var}: Util.getRgbString($color);
  }
}

[data-color-mode='dark'] {
  @each $var, $color in Dark.$dark-vars {
    #{$var}: Util.getRgbString($color);
  }
}
```

## Live Demo

[Demo](https://www.icebreaker.top/)
