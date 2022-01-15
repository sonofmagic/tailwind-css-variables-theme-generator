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
