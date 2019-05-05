const API_ROOT = process.env.API_ROOT

export const getCache = path =>
    fetch(`${API_ROOT}/api/cache?path=${path}`).then(res => {
        if (!res.ok) {
            return null
        }
        return res.text()
    })

export const postCache = (path, content) =>
    fetch(`${API_ROOT}/api/cache`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            path,
            content,
        }),
    }).then(res => res.json())
