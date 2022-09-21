import fs from 'fs'
import path from 'path'

export function cmkdir (dir: string) {
  const existed = fs.existsSync(dir)
  if (!existed) {
    fs.mkdirSync(dir, {
      recursive: true
    })
  }
}

export function getAbsPath (p: string) {
  if (path.isAbsolute(p)) {
    return p
  } else {
    return path.resolve(process.cwd(), p)
  }
}

export function renderTemplete (
  src: string,
  replacement?: Record<string, string>
) {
  let t = fs.readFileSync(src, 'utf-8')
  if (replacement) {
    const replacements = Object.entries(replacement)
    for (let i = 0; i < replacements.length; i++) {
      const [key, value] = replacements[i]
      t = t.replace(key, value)
    }
  }
  return t
}
