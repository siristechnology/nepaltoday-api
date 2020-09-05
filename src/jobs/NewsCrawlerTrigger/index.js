const NewsCrawler = require('news-crawler')
const { saveArticles } = require('../../db-service/newsDbService')
const SourceConfig = require('../../config/news-source-config.json')
const logger = require('../../config/logger')
const { googleTranslate, removeDuplicateArticles } = require('./helper')
const WordPOS = require('wordpos'), wordpos = new WordPOS();

module.exports = async function () {
	const ipAddress = require('ip').address()

	try {
		const articles = await NewsCrawler(SourceConfig, 3)
		let articleWithNouns = []
		for(const article of articles){
			let translated = await googleTranslate(article.title)
			let nouns = await wordpos.getNouns(translated)
			article.nouns = nouns
			articleWithNouns.push(article)
		}

		let newArticles = removeDuplicateArticles(articleWithNouns)
		newArticles.forEach((x) => (x.hostIp = ipAddress))
		await saveArticles(newArticles)
	} catch (error) {
		logger.error('error occured here', error)
	}
	logger.info('JavaScript timer trigger function ran!', new Date().toISOString())
}