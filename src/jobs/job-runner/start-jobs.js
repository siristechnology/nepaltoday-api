require('dotenv').config()
const crawler = require('../NewsCrawlerTrigger/index')
const notifier = require('../NotificationTrigger')
const twitterJob = require('../TwitterTrigger')

const Agenda = require('agenda')

module.exports = async function() {
	const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } })

	agenda.define('crawl articles', async job => {
		console.log('crawl articles job started')
		crawler(console)
	})

	agenda.define('notify users', async job => {
		console.log('notify users job started')
		notifier(console)
	})

	agenda.define('pull tweets', async job => {
		console.log('pull tweets job started')
		twitterJob(console)
	})

	await agenda.start()

	await agenda.every('5 minutes', 'crawl articles')
	await agenda.every('5 minutes', 'notify users')
	await agenda.every('5 minutes', 'pull tweets')
}
