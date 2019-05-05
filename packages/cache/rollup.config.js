import base from '../../rollup.api.config.js'

export default {
    ...base,
    external: ['@google-cloud/storage', 'micro'],
}
