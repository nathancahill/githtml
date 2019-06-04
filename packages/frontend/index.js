import 'isomorphic-fetch'

import crypto from 'crypto'
import url from 'url'
import qs from 'qs'
import preact from 'preact'
import render from 'preact-render-to-string'
import linkify from 'linkify-lite'
import Cookies from 'cookies'
import NowDB from '@nowdb/client'

import { getCache, postCache } from '@githtml/util/lib/cache'
import { parseGithubUrl, getFile, getMarkdown } from '@githtml/util/lib/github'
import { getLanguage } from '@githtml/util/lib/language'
import { wrapLinesInCode } from '@githtml/util'

import { authenticatedWrapper, anonymousWrapper } from './wrappers'
import { Header, Code } from './ui'

const README = '/nathancahill/githtml/blob/master/README.md'
const NOT_A_BLOB = '/nathancahill/githtml/blob/master/NOT_A_BLOB.md'

const nowdb = new NowDB()

export default async (req, res) => {
    const cookies = new Cookies(req, res)
    res.setHeader('content-type', 'text/html; charset=utf-8')

    const { pathname, query } = url.parse(req.url, true)

    // handle oauth code
    if (query.code) {
        const oauthRes = await fetch(
            `https://github.com/login/oauth/access_token?${qs.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: query.code,
            })}`,
            {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                }
            },
        )

        const oauth = await oauthRes.json()
        const apikey = crypto.randomBytes(16).toString('hex')
        const token = oauth.access_token

        await nowdb.fetch('/apikeys', {
            method: 'POST',
            body: JSON.stringify({
                id: apikey,
                token,
            })
        })

        cookies.set('ApiKey', apikey, { overwrite: true, maxAge: 1000 * 60 * 60 * 24 * 365 })

        res.setHeader('location', pathname)
        res.statusCode = 302
        res.end()
        return
    }

    const apikey = query.key || cookies.get('ApiKey')
    let token = null

    if (apikey) {
        const res = await nowdb.fetch(`/apikeys/${apikey}`)
        const json = await res.json()
        token = json.token
    }

    // default to readme
    let urlParts = parseGithubUrl(pathname === '/' ? README : pathname)

    // check path for github file
    if (
        !urlParts.repo ||
        !urlParts.branch ||
        !urlParts.blob ||
        !urlParts.filepath
    ) {
        // if we don't have a blob use the not a blob message
        urlParts = parseGithubUrl(NOT_A_BLOB)
    }

    const options = {
        title: 'GitHtml',
        bodyClass: query.mode === 'dark' ? 'bg-gray-800 text-gray-300' : '',
        limits: { remaining: 60, limit: 60 },
        stylesheet:
            query.mode === 'dark'
                ? 'https://unpkg.com/github-syntax-dark@0.5.0/lib/github-dark.css'
                : 'https://unpkg.com/github-syntax-light@0.5.0/lib/github-light.css',
    }

    let cached = await getCache(`${urlParts.repo}/${urlParts.blob}`)

    if (cached) {
        if (query.ui === 'false') {
            return cached
        }

        if (query.links !== 'false') {
            cached = linkify(cached)
        }

        if (token !== null) {
            const rateLimitRes = await fetch('https://api.github.com/rate_limit', {
                headers: {
                    authorization: `token ${token}`,
                }
            })

            const rateLimit = await rateLimitRes.json()
            options.limits = rateLimit.rate
        }

        return authenticatedWrapper(
            options,
            render(
                <div class="font-body">
                    <Header
                        mode={query.mode}
                        limits={options.limits}
                        pathname={pathname}
                        authenticated={!!token}
                    />
                    <Code
                        mode={query.mode}
                        dangerouslySetInnerHTML={{
                            __html: cached,
                        }}
                    />
                </div>,
            ),
        )
    }

    // check for api key
    //      no api key?
    //          return with client-side functions
    if (token === null) {
        return anonymousWrapper(
            {
                ...options,
                urlParts: JSON.stringify({
                    repo: urlParts.repo,
                    branch: urlParts.branch,
                    blob: urlParts.blob,
                    filepath: urlParts.filepath,
                }),
            },
            render(
                <div class="font-body">
                    <Header
                        mode={query.mode}
                        limits={options.limits}
                        pathname={pathname}
                    />
                    <Code id="code" mode={query.mode}>
                        <div class="py-16">
                            <img
                                class="mx-auto"
                                src="/static/images/loading.svg"
                            />
                        </div>
                    </Code>
                </div>,
            ),
        )
    }

    // get file contents
    const [file, fileLimits] = await getFile(
        urlParts.repo,
        urlParts.branch,
        urlParts.filepath,
        token,
    )
    options.limits = fileLimits

    // get file language
    const content = Buffer.from(file.content, 'base64').toString('utf8')
    const language = await getLanguage(file.path, content)

    // format file with markdown api
    const [rendered, renderedLimits] = await getMarkdown(
        `\`\`\`\`\`\`\`\`\`\`\`\`${language.language}
${content}\`\`\`\`\`\`\`\`\`\`\`\``,
        token,
    )

    options.limits = renderedLimits

    let html = wrapLinesInCode(rendered)

    // save html to cache
    await postCache(`${urlParts.repo}/${urlParts.blob}`, html)

    if (query.links !== 'false') {
        html = linkify(html)
    }

    if (query.ui === 'false') {
        return html
    }

    // return html
    return authenticatedWrapper(
        options,
        render(
            <div class="font-body">
                <Header
                    mode={query.mode}
                    limits={options.limits}
                    pathname={pathname}
                    authenticated
                />
                <Code
                    mode={query.mode}
                    dangerouslySetInnerHTML={{
                        __html: html,
                    }}
                />
            </div>,
        ),
    )
}
