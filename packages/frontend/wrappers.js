export const authenticatedWrapper = (title, html) => `
<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/github-syntax-light@0.5.0/lib/github-light.css" />
</head>
<body>
${html}
<script type="text/javascript" src="/static/js/app.js"></script>
</body>
</html>
`

export const anonymousWrapper = (title, injected, html) => `
<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/github-syntax-light@0.5.0/lib/github-light.css" />
</head>
<body>
${html}
<script type="text/javascript">
var urlParts = ${injected};
</script>
<script type="text/javascript" src="/static/js/app.js"></script>
<script type="text/javascript" src="/static/js/client.js"></script>
</body>
</html>
`
