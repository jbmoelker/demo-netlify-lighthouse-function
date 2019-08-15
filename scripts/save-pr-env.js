#!/usr/bin/env node
const fs = require('fs')

const RUNNERS = {chrome: 'chrome', wpt: 'wpt'};
const [name, owner] = process.env.REPOSITORY_URL 
    ? process.env.REPOSITORY_URL.split('/').reverse() 
    : []

const config = {
    testUrl: process.env.DEPLOY_URL,
    pr: {
        number: parseInt(process.env.REVIEW_ID, 10),
        sha: process.env.COMMIT_REF,
    },
    repo: {
        owner,
        name,
    },
    addComment: true,
    runner: RUNNERS.chrome,
    thresholds: {
        perf: 0,
        pwa: 0,
        seo: 0,
        a11y: 0,
        bp: 0,
    },
}

const outputFilenames = ['dist/client/config.json', 'src/server/lib/config.json']

outputFilenames.map(filename => {
    fs.writeFile(filename, JSON.stringify(config, null, 2), () => {
        console.log(`created ${filename}`)
    })
})
