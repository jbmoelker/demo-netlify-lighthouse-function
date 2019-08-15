#!/usr/bin/env node
const fs = require('fs')

/**
 * https://www.netlify.com/docs/continuous-deployment/#environment-variables
 */
const envNames = [
    'REPOSITORY_URL',
    'PULL_REQUEST',
    'COMMIT_REF',
    'REVIEW_ID',
    'URL',
    'DEPLOY_URL',
    'DEPLOY_PRIME_URL',
]

const netlifyEnv = envNames.reduce((out, VAR_NAME) => {
    return {
        ...out,
        [VAR_NAME]: process.env[VAR_NAME]
    }
}, {})


const outputFilenames = ['dist/client/netlify-env.json', 'src/server/lib/netlify-env.json']

outputFilenames.map(filename => {
    fs.writeFile(filename, JSON.stringify(netlifyEnv, null, 2), () => {
        console.log(`created ${filename}`)
    })
})
