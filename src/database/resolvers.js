const _ = require('lodash')
const { mongooseSchema } = require('nepaltoday-db-service')

const { User } = mongooseSchema
const { categories } = require('../config/category')
const { getSortedArticle } = require('../helper/articleHelper')

exports.resolver = {
	Query: {
		getArticles: async (parent, args, { Article }) => {
			args.criteria = args.criteria || {}
			args.criteria.lastQueryDate = args.criteria.lastQueryDate || new Date('2001-01-01')
			args.criteria.lastArticleId = args.criteria.lastArticleId || '000000000000000000000000'

			const promises = categories.map(async category => {
				const _articles = await Article.find({
					category,
					link: { $ne: null },
					modifiedDate: { $gt: new Date(args.criteria.lastQueryDate) },
					_id: { $gt: args.criteria.lastArticleId },
				})
					.lean()
					.populate({
						path: 'sources',
						match: {
							_id: { $ne: null },
						},
					})
					.sort({ _id: -1 })
					.limit(1)

				return [..._articles]
			})

			const articles = await Promise.all(promises)

			const articleFlatterend = _.flatten(articles)
			const sortedArticles = getSortedArticle(articleFlatterend)

			return sortedArticles
		},

		getTweets: async (parent, args, { Tweet }) => {
			args.criteria = args.criteria || {}
			args.criteria.lastQueryDate = args.criteria.lastQueryDate || new Date('2001-01-01')
			args.criteria.lastTweetId = args.criteria.lastTweetId || '000000000000000000000000'

			const tweets = await Tweet.find()
				.populate('twitterHandle')
				.sort({ publishedDate: -1 })
				.limit(100)

			return tweets
		},
	},
	Mutation: {
		storeFcmToken: async (parent, args) => {
			const {
				input: { fcmToken, countryCode, timeZone },
			} = args
			const user = await User.create({
				fcmToken,
				countryCode,
				timeZone,
			})
			return user
		},
	},
}
