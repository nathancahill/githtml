export const authenticatedWrapper = (options, html) => `
<!DOCTYPE html>
<html>
<head>
    <title>${options.title}</title>
    <link rel="stylesheet" type="text/css" href="${options.stylesheet}" />
</head>
<body>
${html}
<script type="text/javascript" src="/static/js/app.js"></script>
</body>
</html>
`

export const anonymousWrapper = (options, html) => `
<!DOCTYPE html>
<html>
<head>
    <title>${options.title}</title>
    <link rel="stylesheet" type="text/css" href="${options.stylesheet}" />
</head>
<body>
${html}
<script type="text/javascript">
var urlParts = ${options.urlParts};
</script>
<script type="text/javascript" src="/static/js/app.js"></script>
<script type="text/javascript" src="/static/js/client.js"></script>
</body>
</html>
`
