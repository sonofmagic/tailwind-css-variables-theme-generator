
const { generate } = require('../../')
const path = require('path')
  ; (async () => {
    await generate(path.resolve(__dirname, './expose/expose.scss'))
  })()
