import { getLimits } from '@githtml/util/lib/github'

import './app.css'

if (UPDATE_LIMITS) {
    getLimits().then(limits => {
        document.querySelector('#ratelimit').innerHTML = `API calls remaining: ${
            limits.remaining
        }/${limits.limit}`
    })
}
