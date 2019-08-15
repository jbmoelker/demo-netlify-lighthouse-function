import config from '../../../.lighthouse-ci.json'
import netlifyEnv from './netlify-env.json'

const [name, owner] = netlifyEnv.REPOSITORY_URL 
    ? netlifyEnv.REPOSITORY_URL.split('/').reverse() 
    : []

export default {
    ...config,
    testUrl: netlifyEnv.DEPLOY_URL,
    pr: {
        number: parseInt(netlifyEnv.REVIEW_ID, 10),
        sha: netlifyEnv.COMMIT_REF,
    },
    repo: { name, owner }
}
