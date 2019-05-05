import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import buble from 'rollup-plugin-buble'

const PROD = process.env.NODE_ENV === 'production'

export default {
    input: './index.js',
    output: {
        file: './index.js',
        format: 'cjs',
        interop: false,
        outro: `
let __original_lambda = module.exports
exports = module.exports = (req, res) => require('micro').run(req, res, __original_lambda)`,
    },
    plugins: [
        resolve(),
        buble({
            exclude: ['../../node_modules/**', 'node_modules/**'],
            objectAssign: 'Object.assign',
            jsx: 'preact.h',
            transforms: {
                getterSetter: false,
                arrow: false,
                classes: false,
                computedProperty: false,
                conciseMethodProperty: false,
                defaultParameter: false,
                destructuring: false,
                forOf: false,
                generator: false,
                letConst: false,
                moduleExport: false,
                moduleImport: false,
                numericLiteral: false,
                parameterDestructuring: false,
                spreadRest: false,
                stickyRegExp: false,
                templateString: false,
                unicodeRegExp: false,
                exponentiation: false,
                objectRestSpread: false,
                asyncAwait: false,
            },
        }),
        commonjs(),
        replace({
            'process.env.API_ROOT': JSON.stringify(
                PROD ? 'https://githtml.com' : 'http://localhost:5000',
            ),
        }),
    ],
}
