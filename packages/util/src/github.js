import gh from 'parse-github-url'

export const parseGithubUrl = url => {
    const parts = gh(`https://github.com${url}`)
    return parts
}

export const getFile = (repo, branch, path, token = null) => {
    const headers = {}
    if (token !== null) {
        headers.authorization = `token ${token}`
    }

    const fileP = fetch(
        `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`,
        { headers }
    )

    const jsonP = fileP.then(res => {
        if (!res.ok) {
            return Promise.resolve(null)
        }

        return res.json()
    })
    const headersP = fileP.then(res => ({
        limit: res.headers.get('X-RateLimit-Limit'),
        remaining: res.headers.get('X-RateLimit-Remaining'),
    }))

    return Promise.all([jsonP, headersP])
}

export const getMarkdown = (markdown, token = null) => {
    const headers = { 'content-type': 'text/plain' }
    if (token !== null) {
        headers.authorization = `token ${token}`
    }

    const markdownP = fetch(`https://api.github.com/markdown/raw`, {
        method: 'POST',
        headers,
        body: markdown,
    })

    const textP = markdownP.then(res => res.text())
    const headersP = markdownP.then(res => ({
        limit: res.headers.get('X-RateLimit-Limit'),
        remaining: res.headers.get('X-RateLimit-Remaining'),
    }))

    return Promise.all([textP, headersP])
}

export const getLimits = (token = null) => {
    const headers = {}
    if (token !== null) {
        headers.authorization = `token ${token}`
    }

    return fetch(`https://api.github.com/rate_limit`, { headers })
        .then(res => ({
            limit: res.headers.get('X-RateLimit-Limit'),
            remaining: res.headers.get('X-RateLimit-Remaining'),
        }))
}
