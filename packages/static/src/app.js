import { getLimits } from '@githtml/util/lib/github'

import './app.css'
import './embed.css'

if (UPDATE_LIMITS) {
    getLimits().then(limits => {
        document.querySelector('#ratelimit').innerHTML = `API calls remaining: ${
            limits.remaining
        }/${limits.limit}`
    })
}
