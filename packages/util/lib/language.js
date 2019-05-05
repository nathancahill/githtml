'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const API_ROOT = "http://localhost:5000";

const getLanguage = (path, content) =>
    fetch(`${API_ROOT}/api/language`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            path,
            content,
        }),
    }).then(res => res.json());

exports.getLanguage = getLanguage;
