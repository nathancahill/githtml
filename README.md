# GitHtml

Syntax-highlighted HTML markup that matches GitHub 🖍✨

More options, none of the tracking.

> For any blob GitHub URL, change `github.com` to `githtml.com` to load the HTML markup.

## Options

#### `?ui=false`

Return the HTML markup for the code without the GitHtml UI. Useful for embedding server-side 📦

#### `?mode=dark`

Dark mode 🌚

#### `?embed=true`

Return markup as `document.write`, similar to Gist embed code. By default does not include
CSS stylesheets, although they can be included with the options below. Ideally include them once
at the top of your HTML for multiple embeds. The available syntax stylesheets are:

 - https://unpkg.com/github-syntax-light@0.5.0/lib/github-light.css
 - https://unpkg.com/github-syntax-dark@0.5.0/lib/github-dark.css

And a stylesheet for CSS line numbers:

 - https://githtml.com/static/css/embed.css

#### `?embed=true&stylesheet=true`

Embed markup as `document.write`, including light or dark syntax stylesheets.

#### `?embed=true&lineno=true`

Embed markup as `document.write`, including CSS line numbers.

#### `?links=false`

For the UI page only, disable automatically linkifying links in code 🔗

## Credits

https://githtml.com/nathancahill/githtml/blob/master/CREDITS.md
