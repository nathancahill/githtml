import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import { uglify } from 'rollup-plugin-uglify'
import buble from 'rollup-plugin-buble'

const PROD = process.env.NODE_ENV === 'production'

const plugins = [
    resolve({
        preferBuiltins: true,
    }),
    commonjs(),
    replace({
        'process.env.API_ROOT': JSON.stringify(
            PROD ? 'https://githtml.com' : 'http://localhost:5000',
        ),
    }),
    postcss({
        extensions: ['.css'],
    }),
    buble(),
    globals(),
    builtins(),
    PROD && uglify(),
]

export default [
    {
        input: './src/app.js',
        output: {
            file: '../../public/static/js/app.js',
            format: 'iife',
            sourcemap: !PROD,
        },
        plugins,
    },
    {
        input: './src/client.js',
        output: {
            file: '../../public/static/js/client.js',
            format: 'iife',
            sourcemap: !PROD,
        },
        plugins,
    },
]
