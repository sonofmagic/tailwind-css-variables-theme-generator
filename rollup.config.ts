import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { readFileSync } from 'node:fs'
import { visualizer } from 'rollup-plugin-visualizer'
const pkg = JSON.parse(
  readFileSync('./package.json', {
    encoding: 'utf8'
  })
)
const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'

/** @type {import('rollup').RollupOptions} */
const configs = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: isDev
        // exports: 'auto'
      }
      // { format: 'esm', file: pkg.module, sourcemap: isDev }
    ],

    plugins: [
      nodeResolve({
        preferBuiltins: true
      }),
      commonjs(),
      typescript({ tsconfig: './tsconfig.build.json', sourceMap: isDev }),
      isProd
        ? visualizer({
          // emitFile: true,
          filename: 'stats/index.html'
        })
        : undefined
    ],
    external: [...Object.keys(pkg.dependencies), 'tailwindcss']
  }
]

export default configs
