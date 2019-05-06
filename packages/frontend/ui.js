import preact from 'preact'
import classnames from 'classnames'

const Logo = props => (
    <svg viewBox="0 0 80 73" {...props}>
        <path d="M73.338,37 C70.874,37 68.747,38.35 67.593,40.331 L40,40.331 L40,46.999 L67.593,46.999 C68.747,48.985 70.874,50.333 73.338,50.333 C77.015,50.333 80,47.351 80,43.665 C80,39.989 77.015,37 73.338,37 Z" />
        <path d="M73.338,10 C70.874,10 68.747,11.354 67.593,13.334 L40,13.334 L40,20.003 L67.593,20.003 C68.747,21.989 70.874,23.337 73.338,23.337 C77.015,23.336 80,20.354 80,16.668 C80,12.988 77.015,10 73.338,10 Z" />
        <path
            d="M33.332,6.668 L46.668,6.668 C46.668,2.982 43.683,0 40,0 L6.665,0 C2.985,0.001 0,2.986 0,6.668 L0,66.669 C0,70.353 2.985,73.335 6.665,73.335 L40,73.335 C43.683,73.335 46.668,70.353 46.668,66.669 L33.332,66.669 L33.332,6.668 Z M26.667,60.002 L6.665,60.002 L6.665,53.336 L26.667,53.336 L26.667,60.002 Z M26.667,46.668 L6.665,46.668 L6.665,40 L26.667,40 L26.667,46.668 Z M26.667,33.335 L6.665,33.335 L6.665,26.668 L26.667,26.668 L26.667,33.335 Z M26.667,20.002 L6.665,20.002 L6.665,13.333 L26.667,13.333 L26.667,20.002 Z"
            fill-rule="nonzero"
        />
        <path d="M53.336,50 C50.872,50 48.748,51.352 47.591,53.334 L40,53.334 L40,60 L47.591,60 C48.748,61.986 50.872,63.334 53.336,63.334 C57.016,63.334 60.002,60.352 60.002,56.666 C60.002,52.988 57.016,50 53.336,50 Z" />
        <path d="M60.004,24 C57.54,24 55.413,25.351 54.259,27.331 L40,27.331 L40,33.999 L54.259,33.999 C55.413,35.985 57.54,37.333 60.004,37.333 C63.682,37.333 66.667,34.351 66.667,30.665 C66.667,26.989 63.682,24 60.004,24 Z" />
    </svg>
)

export const Header = ({ mode }) => (
    <div
        class={classnames('p-2 flex justify-between items-start', {
            'border-gray-300': mode !== 'dark',
            'border-gray-900': mode === 'dark',
        })}
    >
        <div class="flex items-center">
            <Logo width="26px" class="mr-2 stroke-current fill-current" />
            <h1 class="text-2xl font-bold">GitHtml</h1>
        </div>
        <a
            href="https://github.com/login/oauth/authorize?client_id=b3c844bcc2e22d84e561"
            class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded text-sm"
        >
            Sign In with GitHub
        </a>
    </div>
)

export const Code = ({ mode, ...props }) => (
    <div
        class={classnames(
            'font-code text-xs container mx-auto border rounded py-2 mb-16',
            {
                'border-gray-300': mode !== 'dark',
                'border-gray-900': mode === 'dark',
            },
        )}
        {...props}
    />
)
