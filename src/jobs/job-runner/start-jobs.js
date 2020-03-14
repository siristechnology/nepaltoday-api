require('dotenv').config()
const crawler = require('../NewsCrawlerTrigger/index')
const notifier = require('../NotificationTrigger')
const twitterJob = require('../TwitterTrigger')
const logger = require('../../config/logger')

const Agenda = require('agenda')

module.exports = async function() {
	const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } })

	agenda.define('crawl articles', async job => {
		logger.info('crawl articles job started')
		crawler(console)
	})

	agenda.define('notify users', async job => {
		logger.info('notify users job started')
		notifier(console)
	})

	agenda.define('pull tweets', async job => {
		logger.info('pull tweets job started')
		twitterJob(console)
	})

	await agenda.start()

	await agenda.every('5 minutes', 'crawl articles')
	await agenda.every('5 minutes', 'notify users')
	await agenda.every('5 minutes', 'pull tweets')

	// await agenda.every('5 minutes', 'crawl topics')
}
