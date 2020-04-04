require('dotenv').config()
const Agenda = require('agenda')
const logger = require('../../config/logger')

const crawler = require('../NewsCrawlerTrigger/index')
const notifier = require('../NotificationTrigger')
const twitterJob = require('../TwitterTrigger')
const coronaJob = require('../corona')

module.exports = async function() {
	logger.info('starting jobs')

	const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } })

	agenda.define('crawl articles', async (job) => {
		logger.info('crawl articles job started')
		crawler(console)
	})

	agenda.define('notify users', async (job) => {
		logger.info('notify users job started')
		notifier(console)
	})

	agenda.define('pull tweets', async (job) => {
		logger.info('pull tweets job started')
		twitterJob(console)
	})

	agenda.define('fetch corona stats', async (job) => {
		logger.info('corona job started')
		coronaJob()
	})

	await agenda.start()

	await agenda.every('5 minutes', 'crawl articles')
	await agenda.every('5 minutes', 'notify users')
	await agenda.every('5 minutes', 'pull tweets')
	await agenda.every('2 hours', 'fetch corona stats')
}
