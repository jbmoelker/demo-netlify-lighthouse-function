/**
 * Adapted from https://github.com/GoogleChromeLabs/lighthousebot/blob/master/runlighthouse.js
 */
import request from 'request-promise-native'
import config from '../lib/config.json'
const RUNNERS = {chrome: 'chrome', wpt: 'wpt'};

const CI_HOST = 'https://lighthouse-ci.appspot.com';
const API_KEY = process.env.LIGHTHOUSE_API_KEY;

export const handler = (event, context, callback) => {
    const send = body => callback(null, { statusCode: 200, body: JSON.stringify(body) })

    let endpoint;
    let body = config;
    switch (config.runner) {
        case RUNNERS.wpt:
            endpoint = `${CI_HOST}/run_on_wpt`;
            break;
        case RUNNERS.chrome: // same as default
        default:
            endpoint = `${CI_HOST}/run_on_chrome`;
            body = Object.assign({output: 'json'}, config);
    }

    if (!config.pr.number) {
        console.log('Lighthouse is not run for non-PR commits.');
        return
    }
    console.log('Request Lighthouse audit with:', JSON.stringify({ endpoint, body }))
    console.log('Test URL', config.testUrl)

    request({
        method: 'POST',
        uri: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY
        },
        body,
        json: true,
    })
    .then(scores => {
        console.log('New Lighthouse scores:', scores)
        send({ config })
    })
    .catch(err => {
        console.log('Lighthouse CI failed', err);
        callback(null, { statusCode: 501, body: `<pre>${JSON.stringify(err, null, 2)}<pre>` })
    })
}
