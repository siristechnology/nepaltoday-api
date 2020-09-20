const NewsCrawler = require('news-crawler')
const { saveArticles } = require('../../db-service/newsDbService')
const SourceConfig = require('../../config/news-source-config.json')
const logger = require('../../config/logger')
const { googleTranslate, removeDuplicateArticles, filterNewArticles, getTagsFromArticle } = require('./helper')
const { Article, TrendingTopic } = require('../../db-service/database/mongooseSchema')
const WordPOS = require('wordpos')
const wordpos = new WordPOS()

module.exports = async function () {
	const ipAddress = require('ip').address()

	try {
		const articles = await NewsCrawler(SourceConfig, 3)
		const trendingTopics = await TrendingTopic.find()
		const savedArticles = await Article.find({ createdDate: { $gt: new Date(Date.now() - 12 * 60 * 60 * 1000) } })
		const articleWithNouns = []
		for (const article of articles) {
			if(savedArticles.filter(x=> x.title==article.title).length == 0){
				const translated = await googleTranslate(article.title)
				const nouns = await wordpos.getNouns(translated)
				article.nouns = nouns
				if(trendingTopics.length > 0){
					article.tags = getTagsFromArticle(trendingTopics[0].topics, article.content)
				}
				articleWithNouns.push(article)
			}
		}

		const newFilteredArticles = removeDuplicateArticles(articleWithNouns)

		const checkWithOldArticles = filterNewArticles(newFilteredArticles, savedArticles)

		checkWithOldArticles.forEach((x) => (x.hostIp = ipAddress))

		await saveArticles(checkWithOldArticles)
	} catch (error) {
		logger.error('Error while crawling:', error)
	}
	logger.info('News Crawler ran!', new Date().toISOString())
}
