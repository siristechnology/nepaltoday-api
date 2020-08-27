const ipAddress = require('ip').address()
const newsDbService = require('../../db-service/newsDbService')
const newsCrawler = require('news-crawler')

module.exports = async function () {
	let timeStamp = new Date().toISOString()

	const sourceConfig = require('./config/news-source-config.json')
	const articles = await newsCrawler(sourceConfig)
	const sources = newsDbService.getAllSources()

	articles.map((article) => {
		article.createdDate = timeStamp
		article.modifiedDate = timeStamp
		article.publishedDate = timeStamp
		// article.isHeadline = true
		article.hostIp = ipAddress

		article.link = article.url
		article.imageLink = article.leadImage
		article.source = sources.find((source) => source.name === article.source)._id

		newsDbService.saveArticle(article)
	})

	console.log('No. of articles stored. ', articles.length)
}
