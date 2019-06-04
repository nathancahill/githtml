import base from '../../rollup.api.config.js'

export default {
    ...base,
    external: [
        'parse-github-url',
        'isomorphic-fetch',
        'crypto',
        'url',
        'preact',
        'preact-render-to-string',
        'linkify-lite',
    ],
}
