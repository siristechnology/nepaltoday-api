const NewsCrawler = require('news-crawler')
const { saveArticles } = require('../../db-service/newsDbService')
const SourceConfig = require('../../config/news-source-config.json')
const logger = require('../../config/logger')

module.exports = async function () {
	const ipAddress = require('ip').address()

	try {
		const articles = await NewsCrawler(SourceConfig, 3)
		articles.forEach((x) => (x.hostIp = ipAddress))
		await saveArticles(articles)
	} catch (error) {
		logger.error('error occured here', error)
	}
	logger.info('JavaScript timer trigger function ran!', new Date().toISOString())
}
