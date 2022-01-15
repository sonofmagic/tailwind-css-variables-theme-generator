const fsp = require('fs/promises')

  ; (async () => {
  await fsp.cp('src/t/', 'dist/t/', {
    recursive: true
  })
})()
