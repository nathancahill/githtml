import 'isomorphic-fetch'

import url from 'url'
import preact from 'preact'
import render from 'preact-render-to-string'
import linkify from 'linkify-lite'

import { getCache, postCache } from '@githtml/util/lib/cache'
import { parseGithubUrl, getFile, getMarkdown } from '@githtml/util/lib/github'
import { getLanguage } from '@githtml/util/lib/language'
import { wrapLinesInCode } from '@githtml/util'

import { authenticatedWrapper, anonymousWrapper } from './wrappers'
import { Header, Code } from './ui'

const README = '/nathancahill/githtml/blob/master/README.md'
const NOT_A_BLOB = '/nathancahill/githtml/blob/master/NOT_A_BLOB.md'

export default async (req, res) => {
    res.setHeader('content-type', 'text/html; charset=utf-8')

    // default to readme
    const { pathname, query } = url.parse(req.url, true)
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

        return authenticatedWrapper(
            options,
            render(
                <div class="font-body">
                    <Header mode={query.mode} />
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
    if (!req.apikey) {
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
                    <Header mode={query.mode} />
                    <Code id="code" mode={query.mode} />
                </div>,
            ),
        )
    }

    // get oauth token from google

    // get file contents
    const file = await getFile(
        urlParts.repo,
        urlParts.branch,
        urlParts.filepath,
    )

    // get file language
    const content = Buffer.from(file.content, 'base64').toString('utf8')
    const language = await getLanguage(file.path, content)

    // format file with markdown api
    const rendered = await getMarkdown(`\`\`\`\`\`\`\`\`\`\`\`\`${
        language.language
    }
${content}
\`\`\`\`\`\`\`\`\`\`\`\``)

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
                <Header mode={query.mode} />
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
