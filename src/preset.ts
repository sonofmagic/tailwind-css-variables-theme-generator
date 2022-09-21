import type { Config } from 'tailwindcss'
import { IGenerateOption } from './types'
export default function createPreset (
  options: IGenerateOption
): Partial<Config> {
  return {
    theme: {
      extend: {
        colors: {}
      }
    }
  }
}
