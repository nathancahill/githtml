import gh from 'parse-github-url'

export const parseGithubUrl = url => {
    const parts = gh(`https://github.com${url}`)
    return parts
}

export const getFile = (repo, branch, path, token = null) =>
    fetch(
        `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`,
    ).then(res => res.json())

export const getMarkdown = (markdown, token = null) =>
    fetch(`https://api.github.com/markdown/raw`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain',
        },
        body: markdown,
    }).then(res => res.text())
