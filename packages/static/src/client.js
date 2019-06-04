import linkify from 'linkify-lite'
import { postCache } from '@githtml/util/lib/cache'
import { getFile, getMarkdown } from '@githtml/util/lib/github'
import { getLanguage } from '@githtml/util/lib/language'
import { wrapLinesInCode } from '@githtml/util'

const fileP = getFile(urlParts.repo, urlParts.branch, urlParts.filepath)

const contentP = fileP.then(([file, limits]) =>
    Buffer.from(file.content, 'base64').toString('utf8'),
)

const languageP = Promise.all([fileP, contentP]).then(
    ([[file, limits], content]) => getLanguage(file.path, content),
)

const renderedP = Promise.all([languageP, contentP]).then(
    ([language, content]) =>
        getMarkdown(`\`\`\`\`\`\`\`\`\`\`\`\`${language.language}
${content}\`\`\`\`\`\`\`\`\`\`\`\``),
)

renderedP.then(([rendered, limits]) => {
    let html = wrapLinesInCode(rendered)
    postCache(`${urlParts.repo}/${urlParts.blob}`, html)

    const query = new URLSearchParams(document.location.search)

    if (query.links !== 'false') {
        html = linkify(html)
    }

    document.querySelector('#code').innerHTML = html
    document.querySelector('#ratelimit').innerHTML = `API calls remaining: ${
        limits.remaining
    }/${limits.limit}`
})
