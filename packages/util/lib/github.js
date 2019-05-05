'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var gh = _interopDefault(require('parse-github-url'));

const parseGithubUrl = url => {
    const parts = gh(`https://github.com${url}`);
    return parts
};

const getFile = (repo, branch, path, token = null) =>
    fetch(
        `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`
    ).then(res => res.json());

const getMarkdown = (markdown, token = null) =>
    fetch(`https://api.github.com/markdown/raw`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain',
        },
        body: markdown,
    }).then(res => res.text());

exports.getFile = getFile;
exports.getMarkdown = getMarkdown;
exports.parseGithubUrl = parseGithubUrl;
