/**
 * Adapted from https://github.com/GoogleChromeLabs/lighthousebot/blob/master/runlighthouse.js
 */
import request from 'request-promise-native'
const RUNNERS = {chrome: 'chrome', wpt: 'wpt'};

const CI_HOST = 'https://lighthouse-ci.appspot.com';
const API_KEY = process.env.LIGHTHOUSE_API_KEY;

export default ({ config }) => {
    let endpoint;
    let body = config;
    config.testUrl = config.testUrl.replace('https://', 'https://demo:tryme@') + '/protected'

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

    return request({
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
        console.log('New Lighthouse scores:', scores);
        return scores;
    })
    .catch(err => {
        console.log('Lighthouse CI failed', err);
        return new Promise.reject(err);
    });
};
