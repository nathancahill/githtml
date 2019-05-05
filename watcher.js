const clearModule = require('clear-module')
const fs = require('fs')
const path = require('path')
const rollup = require('rollup')
const micro = require('micro')
const debounce = require('lodash/debounce')

function loadConfigFile(configFile) {
    return rollup
        .rollup({
            external: id => {
                return (
                    (id[0] !== '.' && !path.isAbsolute(id)) ||
                    id.slice(-5, id.length) === '.json'
                )
            },
            input: configFile,
            treeshake: false,
        })
        .then(function(bundle) {
            return bundle.generate({
                exports: 'named',
                format: 'cjs',
            })
        })
        .then(function(_a) {
            var code = _a.output[0].code
            // temporarily override require
            var defaultLoader = require.extensions['.js']
            require.extensions['.js'] = function(module, filename) {
                if (filename === configFile) {
                    module._compile(code, filename)
                } else {
                    defaultLoader(module, filename)
                }
            }
            delete require.cache[configFile]
            return Promise.resolve(require(configFile))
                .then(function(configFileContent) {
                    if (configFileContent.default)
                        configFileContent = configFileContent.default
                    if (typeof configFileContent === 'function') {
                        return configFileContent(commandOptions)
                    }
                    return configFileContent
                })
                .then(function(configs) {
                    require.extensions['.js'] = defaultLoader
                    return Array.isArray(configs) ? configs : [configs]
                })
        })
}

const requireFromString = (src, filename) => {
    const m = new module.constructor()
    m.paths = module.paths
    m._compile(src, filename)
    return m
}

const configPath = path.resolve('rollup.config.js')
let config = {}
let watchedPaths = new Set()
let server
let port = parseInt(process.argv[2])

const build = debounce(async () => {
    if (server) {
        console.log('Restarting...')
        server.close()
    }

    const bundle = await rollup.rollup({ ...config, onwarn: () => {} })
    const { output } = await bundle.generate({ format: 'cjs', interop: false })

    for (let p of bundle.watchFiles) {
        if (p.startsWith('\u0000')) {
            continue
        }

        if (!watchedPaths.has(p)) {
            watchedPaths.add(p)
            fs.watch(p, build)
        }
    }

    server = micro(async (req, res) => {
        clearModule.all()
        const m = requireFromString(output[0].code, output[0].facadeModuleId)
        return m.exports(req, res)
    })
    console.log(`Listening on http://localhost:${port}`)

    server.listen(port)
}, 500)

loadConfigFile(configPath).then(loaded => {
    config = loaded[0]
    return build()
})
