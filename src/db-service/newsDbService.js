const { Article } = require('./database/mongooseSchema')
const logger = require('../config/logger')
const Sources = require('./../config/source-data')

module.exports = {
	saveArticles: async (articles) => {
		try {
			const savedArticles = await Article.insertMany(articles, { ordered: false })
			return savedArticles
		} catch (error) {
			if (error.code === 11000 || error.code === 11001) {
				logger.debug('ignored duplicates')
			} else {
				logger.error(error)
			}
			return error
		}
	},

	saveArticle: async (article) => {
		try {
			return await Article.create(article)
		} catch (error) {
			if (error.code === 11000 || error.code === 11001) {
				logger.debug('ignored duplicates')
			} else {
				logger.error(error)
			}
		}
		return null
	},

	deleteArticles: async (conditions) => {
		const deletedArticles = await Article.deleteMany(conditions)
		return deletedArticles
	},

	getArticles: async () => {
		const newsArticles = await Article.find()
		return newsArticles
	},

	getLatestNewsArticle: async () => {
		const latestNewsArticle = await Article.find({ category: 'news' }).sort({ _id: -1 }).limit(1).lean()

		const articleWithSource = latestNewsArticle.map((article) => {
			const mySource = Sources.find((x) => x.name === article.sourceName)
			article.source = {
				name: mySource.name,
				url: mySource.link,
				logoLink: process.env.SERVER_BASE_URL + mySource.logoLink,
			}
			return article
		})

		return articleWithSource
	},

	getAllSources: () => {
		return Sources
	},

	isExist: async (newslink) => {
		const count = await Article.count({ link: newslink })
		return count > 0
	},
}
