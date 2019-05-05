import base from '../../rollup.api.config.js'

export default {
    ...base,
    external: ['parse-github-url', 'isomorphic-fetch'],
}
