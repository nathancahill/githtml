import base from '../../rollup.api.config.js'

export default {
    ...base,
    input: {
        index: 'src/index.js',
        cache: 'src/cache.js',
        github: 'src/github.js',
        language: 'src/language.js',
    },
    output: {
        dir: 'lib',
        format: 'cjs',
    },
    external: ['parse-github-url'],
}
