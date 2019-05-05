'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const wrapLinesInCode = lines =>
    `<code>${lines.split('\n').join('</code>\n<code>')}</code>`;

exports.wrapLinesInCode = wrapLinesInCode;
