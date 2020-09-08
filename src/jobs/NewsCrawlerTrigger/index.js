const NewsCrawler = require('news-crawler')
const { saveArticles } = require('../../db-service/newsDbService')
const SourceConfig = require('../../config/news-source-config.json')
const logger = require('../../config/logger')
const { googleTranslate, removeDuplicateArticles, filterNewArticles } = require('./helper')
const { Article } = require('../../db-service/database/mongooseSchema')
const WordPOS = require('wordpos'), wordpos = new WordPOS();

module.exports = async function () {
	const ipAddress = require('ip').address()

	try {
		const articles = await NewsCrawler(SourceConfig, 3)

		const savedArticles = await Article.find({"createdDate":{$gt: new Date(Date.now() - 12*60*60*1000)}})

		let articleWithNouns = []
		for(const article of articles){
			let translated = await googleTranslate(article.title)
			let nouns = await wordpos.getNouns(translated)
			article.nouns = nouns
			articleWithNouns.push(article)
		}

		let newFilteredArticles = removeDuplicateArticles(articleWithNouns)

		let checkWithOldArticles = filterNewArticles(newFilteredArticles, savedArticles)

		checkWithOldArticles.forEach((x) => (x.hostIp = ipAddress))
		
		await saveArticles(checkWithOldArticles)
	} catch (error) {
		logger.error('error occured here', error)
	}
	logger.info('JavaScript timer trigger function ran!', new Date().toISOString())
}