import { postCache } from '@githtml/util/lib/cache'
import { getFile, getMarkdown } from '@githtml/util/lib/github'
import { getLanguage } from '@githtml/util/lib/language'
import { wrapLinesInCode } from '@githtml/util'

const fileP = getFile(urlParts.repo, urlParts.branch, urlParts.filepath)

const contentP = fileP.then(file =>
    Buffer.from(file.content, 'base64').toString('utf8'),
)

const languageP = Promise.all([fileP, contentP]).then(([file, content]) =>
    getLanguage(file.path, content),
)

const renderedP = Promise.all([languageP, contentP]).then(
    ([language, content]) =>
        getMarkdown(`\`\`\`\`\`\`\`\`\`\`\`\`${language.language}
${content}
\`\`\`\`\`\`\`\`\`\`\`\``),
)

renderedP.then(rendered => {
    const html = wrapLinesInCode(rendered)
    document.querySelector('#code').innerHTML = html

    postCache(`${urlParts.repo}/${urlParts.blob}`, html)
})
