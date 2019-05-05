import preact from 'preact'

export const Header = () => (
    <div class="p-2 flex items-center border-b border-gray-300">
        <img src="/static/images/icon-2.svg" width="26px" class="mr-2" />
        <h1 class="text-2xl font-bold">GitHtml</h1>
    </div>
)

export const Code = props => (
    <div
        class="font-code text-xs container mx-auto border-l border-r border-b rounded-b border-gray-300 mb-16"
        {...props}
    />
)
