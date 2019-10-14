const _ = require('lodash')
const { categories } = require('../config/category')

exports.resolver = {
	Query: {
		getArticles: async (parent, args, { Article }) => {
			args.criteria = args.criteria || {}
			args.criteria.lastQueryDate = args.criteria.lastQueryDate || new Date('2001-01-01')
			args.criteria.lastArticleId = args.criteria.lastArticleId || '000000000000000000000000'

			const _categories = Object.values(categories)
			const promises = _categories.map(async category => {
				const _articles = await Article.find({
					category,
					link: { $ne: null },
					modifiedDate: { $gt: new Date(args.criteria.lastQueryDate) },
					_id: { $gt: args.criteria.lastArticleId },
				})
					.populate('source')
					.sort({ _id: -1 })
					.limit(20)
				return [..._articles]
			})

			const articles = await Promise.all(promises)

			const articleFlatterend = _.flatten(articles)

			return articleFlatterend
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
}
