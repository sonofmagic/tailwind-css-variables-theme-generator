import fsp from 'fs/promises'
import { constants } from 'fs'

export async function cmkdir (dir: string) {
  try {
    await fsp.access(dir, constants.F_OK)
  } catch (error) {
    await fsp.mkdir(dir, {
      recursive: true
    })
  }
}

export async function renderTemplete (
  src: string,
  replacement: Record<string, string>
) {
  let t = await fsp.readFile(src, 'utf-8')
  if (replacement) {
    const replacements = Object.entries(replacement)
    for (let i = 0; i < replacements.length; i++) {
      const [key, value] = replacements[i]
      t = t.replace(key, value)
    }
  }
  return t
}
