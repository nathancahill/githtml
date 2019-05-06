const meta = options => `
<title>${options.title}</title>
<meta charset="utf-8" />
<link rel="icon" type="image/png" sizes="32x32" href="/static/images/32x32.png" />
<link rel="stylesheet" type="text/css" href="${options.stylesheet}" />
`

export const authenticatedWrapper = (options, html) => `
<!DOCTYPE html>
<html>
<head>
${meta(options)}
</head>
<body class="${options.bodyClass}">
${html}
<script type="text/javascript" src="/static/js/app.js"></script>
</body>
</html>
`

export const anonymousWrapper = (options, html) => `
<!DOCTYPE html>
<html>
<head>
${meta(options)}
</head>
<body class="${options.bodyClass}">
${html}
<script type="text/javascript">
var urlParts = ${options.urlParts};
</script>
<script type="text/javascript" src="/static/js/app.js"></script>
<script type="text/javascript" src="/static/js/client.js"></script>
</body>
</html>
`
