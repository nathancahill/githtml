export const wrapLinesInCode = lines =>
    `<code>${lines.split('\n').join('</code>\n<code>')}</code>`
