
const sass = require('sass')
const fsp = require('fs/promises')
const path = require('path')

function getKey (str) {
  return str
}

function jsFilter (str) {
  return `withOpacityValue('${str}')`
}

function scssFilter (str) {
  return `rgb(var(${str}))`
}

// The asynchronous variants are much slower

async function generate (exposeFilePath) {
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
  const mergedMap = {}
  for (let i = 0; i < exposeAarry.length; i++) {
    const map = exposeAarry[i]
    for (const [key, color] of map) {
      mergedMap[key.text] = `${color.red} ${color.green} ${color.blue}` // ${color.alpha}
    }
  }

  const keys = Object.keys(mergedMap)

  const getScssVarName = getKey
  const getScssVarValue = scssFilter
  // scss
  // ${{ removeColorPrefix(k) }}:{{ scssFilterShadow(k) }};
  const scssResult = keys.map(x => {
    return `$${getScssVarName(x)}:${getScssVarValue(x)};`
  }).join('\n')
  const targetDir = path.dirname(exposeFilePath)
  await fsp.writeFile(path.resolve(targetDir, 'variables.scss'), scssResult)

  // js:
  // '{{ removeColorPrefix(k) }}':{{ jsFilterShadow(k) }},
  const placeholder = '/* {{placeholder}} */'

  const extendColorsTemplete = fsp.readFile(path.resolve(__dirname, './t/js/extendColors.js'), 'utf-8')
  const getJsVarName = getKey
  const getJsVarValue = jsFilter
  const jsResult = keys.map(x => {
    return `'${getJsVarName(x)}':${getJsVarValue(x)},`
  }).join('\n')

  await fsp.writeFile(path.resolve(targetDir, 'extendColors.js'), (await extendColorsTemplete).replace(placeholder, jsResult))

  await fsp.copyFile(path.resolve(__dirname, './t/scss/util.scss'), path.resolve(targetDir, 'util.scss'))
  await fsp.copyFile(path.resolve(__dirname, './t/scss/root.scss'), path.resolve(targetDir, 'root.scss'))
  await fsp.copyFile(path.resolve(__dirname, './t/scss/export.scss'), path.resolve(targetDir, 'export.scss'))
}

module.exports = {
  generate
}
