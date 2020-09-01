const NewsCrawler = require('news-crawler')
const { saveArticles } = require('../../db-service/newsDbService')
const SourceConfig = require('../../config/news-source-config.json')

module.exports = async function (context) {
	const ipAddress = require('ip').address()

	try {
		const articles = await NewsCrawler(SourceConfig, 3)
		articles.forEach((x) => (x.hostIp = ipAddress))
		await saveArticles(articles)
	} catch (error) {
		context.log('error occured here', error)
	}
	context.log('JavaScript timer trigger function ran!', new Date().toISOString())
}
