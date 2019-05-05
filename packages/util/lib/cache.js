'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const API_ROOT = "http://localhost:5000";

const getCache = path =>
    fetch(`${API_ROOT}/api/cache?path=${path}`).then(res => {
        if (!res.ok) {
            return null
        }
        return res.text()
    });

const postCache = (path, content) =>
    fetch(`${API_ROOT}/api/cache`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            path,
            content,
        }),
    }).then(res => res.json());

exports.getCache = getCache;
exports.postCache = postCache;
