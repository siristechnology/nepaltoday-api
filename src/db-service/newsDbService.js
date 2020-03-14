const { Article, Source } = require('./database/mongooseSchema')
const logger = require('../config/logger')

module.exports = {
	saveArticles: async articles => {
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

	saveArticle: async article => {
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

	deleteArticles: async conditions => {
		const deletedArticles = await Article.deleteMany(conditions)
		return deletedArticles
	},

	getArticles: async () => {
		const newsArticles = await Article.find()
		return newsArticles
	},

	getLatestNewsArticle: async () => {
		const latestNewsArticle = await Article.find({ category: 'news' })
			.sort({ _id: -1 })
			.limit(1)
			.lean()
		return latestNewsArticle
	},

	getAllSources: async () => {
		const sources = await Source.find()
		return sources
	},

	isExist: async newslink => {
		const count = await Article.count({ link: newslink })
		return count > 0
	},
}
