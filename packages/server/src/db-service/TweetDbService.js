const { Tweet } = require('./database/mongooseSchema')
const logger = require('../config/logger')
const { TrendingTwitterHandles } = require('./../config/twitter-handles')

module.exports = {
	getTwitterHandles: async () => {
		return TrendingTwitterHandles
	},

	saveTweets: async (tweets) => {
		try {
			const tweetSaved = await Tweet.insertMany(tweets, {
				ordered: false,
			})
			return tweetSaved
		} catch (error) {
			if (error.code === 11000 || error.code === 11001) {
				logger.debug('ignored duplicates')
			} else {
				logger.error('Error on saveTweets:', error)
			}
		}
	},

	deleteTweets: async (conditions) => {
		return Tweet.deleteMany(conditions)
	},

	getTweets: async () => {
		return Tweet.find()
	},
}
