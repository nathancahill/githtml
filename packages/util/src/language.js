const API_ROOT = process.env.API_ROOT

export const getLanguage = (path, content) =>
    fetch(`${API_ROOT}/api/language`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            path,
            content,
        }),
    }).then(res => res.json())
