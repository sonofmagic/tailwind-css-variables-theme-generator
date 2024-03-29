# tailwind-css-variables-theme-generator

[English]('./README_en.md')

> 一种基于 `tailwindcss` 的 `just-in-time` 模式的动态多主题色快速生成，和管理方案。

- [tailwind-css-variables-theme-generator](#tailwind-css-variables-theme-generator)
  - [特性](#特性)
  - [使用方式](#使用方式)
    - [安装](#安装)
    - [准备需要被暴露的变量文件](#准备需要被暴露的变量文件)
    - [作为 `Tailwindcss Plugin` 来使用](#作为-tailwindcss-plugin-来使用)
    - [作为 `Nodejs` 脚本来使用](#作为-nodejs-脚本来使用)
  - [原理](#原理)

## 特性

- 可作为 `tailwindcss` 插件运行， `tailwindcss` IDE 智能提示插件友好
- 全局的 `scss` 变量注入 (`additionalData`)
- 生成 `scss` 工具类，方案自由可完全由前端或者后端数据自定义

## 使用方式

### 安装

```bash
npm i -D tailwind-css-variables-theme-generator sass
# or
yarn add -D tailwind-css-variables-theme-generator sass
```

### 准备需要被暴露的变量文件

1. 创建一个或者多个 `sass:map`:

```scss
// constants.scss
$root-vars: (
  --color-canvas-default-transparent: rgba(32, 54, 85, 0),
  --color-marketing-icon-primary: #053c74,
  --color-custom-text-color: #546821
);
// another style
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

> 小技巧：你可以直接从 chrome devtool 把其他网站，所有的变量全部复制下来之后，只要把 `';'` 符号替换成 `','`，就快速产生了一个 `sass:map`。

2. 把这些数据提取出来

```scss
// expose.scss
// 刚刚那个文件
@use './constants.scss' as C;
// same as expose-with-selector(C.$root-style1-vars, ":root")
$style0: expose(C.$root-vars); 
$style1: expose-with-selector(C.$root-style1-vars, "[data-color-mode='light']");
$style2: expose-with-selector(C.$root-style2-vars, "[data-color-mode='dark']");
```

这样数据部分就准备完成了！

### 作为 `Tailwindcss Plugin` 来使用

在 `tailwind.config.js` 中引入，并添加配置：

```js
const { createPlugin } = require('tailwind-css-variables-theme-generator')

/** @type {import('tailwindcss').Config} */
module.exports = {
  // ...
  plugins: [
    createPlugin({
      // 推荐使用绝对路径，相对路径基于 process.cwd ，一旦 cwd 路径不对插件容易报错
      entryPoint: 'path/to/expose.scss'
    })
  ],
}
```

添加后，插件会自动去修改 `theme.extend.colors` 和 `@tailwind base;`，把主题颜色和`css`变量，自动注入进来。

这时候你就可以写：

```html
<div class="text-color-custom-text-color">
  <p class="bg-color-canvas-default-transparent/70">hello</p>
</div>
```

> 默认的生成类名为tailwindcss变量前缀(text,bg,border...)，加自定义变量名

插件会自动生成 `css`:

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

当然工具类的名称是可以自定义的，比如要去除 `-color-` 这样的变量前缀，就可以这样配置：

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

这样，上述的类名就变成了这样：

```html
<div class="text-custom-text-color">
  <p class="bg-canvas-default-transparent/70">hello</p>
</div>
```

### 作为 `Nodejs` 脚本来使用

当作为 `Nodejs` 脚本来使用时，核心表现为生成文件，让用户自定义引入哪些文件进行使用。

例如：

```js
const { generateSync } = require('tailwind-css-variables-theme-generator')
const path = require('path')
// 在 expose.scss 所在目录生成文件
generateSync({
  entryPoint: path.resolve(__dirname, 'path/to/expose.scss')
})
```

当然也有更精细的文件生成配置：

```js
const { generateSync } = require('tailwind-css-variables-theme-generator')
const path = require('path')

generateSync({
  // entryPoint
  entryPoint: path.resolve(__dirname, './expose/expose.scss'),
  // default '.'， 生成文件夹的名称
  outdir: 'expose',
  // output file 生成各个文件的配置
  files: {
    // extendColors.js for tailwindcss v3
    // 扩展的主题色文件
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
    // 全局注入的 scss 变量文件
    variables: {
      getVarName(str) {
        return str.substring(8)
      }
    },
    // object | true | undefined -> generate this file
    // false -> not generate this file
    // webpack export 文件
    export: {
      replacement: {
        '{{filepath}}': '../constants.scss',
        '{{variableName}}': '$root-vars'
      }
    },
    // replacement : Record<string,string>
    // root css 变量文件
    root: {
      replacement: {
        '{{filepath}}': '../constants.scss',
        '{{variableName}}': '$root-vars'
      }
    },
    // boolean: false -> not generate this file
    // scss 工具类文件
    util: true
  },
  // sass 配置
  sassOptions: {
    // ...
  }
})
```

接着，你只需要把这些文件，各自引入即可，比如：

- `extendColors.js`:

```js
// tailwind.config.js
const extendColors = require('path/to/extendColors')
module.exports = {
  theme:{
    extend:{
      colors:{
        // ...
        ...extendColors.colors,
      }
    }
  }
}
```

- `variables.scss`

```js
// webpack.config.js / vue.config.js / nuxt.config.js
loaders: {
  scss: {
    additionalData: '@use "path/to/variables.scss" as *;',
    sassOptions: {
      quietDeps: true,
    },
  },
}
```

- `root.scss` | `export.scss` | `util.scss`

全局引入的变量，工具类模板，可生成后，根据各自项目的情况自行修改。

## 原理

[动态调整web系统主题? 看这一篇就够了](https://juejin.cn/post/7043359491382837255)

[动态调整web主题(2) 萃取篇](https://juejin.cn/post/7053671539094323214)

[customizing-colors#using-css-variables](https://tailwindcss.com/docs/customizing-colors#using-css-variables)
