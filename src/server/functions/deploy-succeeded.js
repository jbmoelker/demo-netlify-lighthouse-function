import lighthouseConfig from '../lib/lighthouse-config'
import startLighthouse from '../lib/start-lighthouse'

export const handler = (event, context, callback) => {

    startLighthouse({ config: lighthouseConfig })
        .then(scores => callback(null, { 
            statusCode: 200, 
            body: JSON.stringify({ scores }) 
        }))
        .catch(err => callback(null, { 
            statusCode: 501, 
            body: `<pre>${JSON.stringify(err, null, 2)}<pre>` 
        }))
}
