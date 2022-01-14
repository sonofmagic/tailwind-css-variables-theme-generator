const sass = require('sass')

function removeColorPrefix (str) {
  return str.substring(8)
}

function jsFilterShadow (str) {
  return `withOpacityValue('${str}')`
}

function scssFilterShadow (str) {
  return `rgb(var(${str}))`
}
// js:
// '{{ removeColorPrefix(k) }}':{{ jsFilterShadow(k) }},

// scss
// ${{ removeColorPrefix(k) }}:{{ scssFilterShadow(k) }};

// const fsp = require('fs/promises')
// The asynchronous variants are much slower

export async function main (exposeFilePath) {
  const exposeAarry = []
  sass.compile(exposeFilePath, {
    functions: {
      'expose($map)': (args) => {
        const value = args[0].assertMap('map')
        const map = value.contents
        exposeAarry.push(map)
        return value
      }
    }
  })

  for (let i = 0; i < exposeAarry.length; i++) {
    const map = exposeAarry[i]
    for (const [key, color] of map) {
      console.log(key.text, `${color.red} ${color.green} ${color.blue} / ${color.alpha}`)
    }
  }
}
