require('./config/env')
require('./db-service/initialize')
const startJobs = require('./jobs/job-runner/start-jobs')

if (process.env.START_JOBS !== 'false') startJobs()
