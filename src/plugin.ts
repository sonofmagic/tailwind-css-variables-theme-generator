import twPlugin from 'tailwindcss/plugin'
import { IGenerateOption } from './types'

export default function createPlugin (options: IGenerateOption) {
  if (options && options.write === undefined) {
    // 插件模式，默认禁用 fs write
    options.write = false
  }
  return twPlugin(({ addUtilities }) => {})
}
