/* eslint-disable eqeqeq */
const _ = require('lodash')
const { User, Article, Like, Dislike, Tweet, FavoriteFM, ReadArticle } = require('../db-service/database/mongooseSchema')
const { categories } = require('../config/category')
const getWeather = require('../weather')
const logger = require('../config/logger')
const SourceConfig = require('../config/news-source-config.json')
const { fmDetails } = require('./../config/fm')
const { calculateTotalWeights } = require('./calculateTotalWeights')
const NepaliEvents = require('../config/nepali-events.json')
const { getTwitterHandles } = require('../db-service/TweetDbService')
const trendingTagDbService = require('../db-service/trendingTagDbService')

module.exports = {
	Query: {
		getArticles: async (parent, args) => {
			args.criteria = args.criteria || {}
			args.criteria.lastQueryDate = args.criteria.lastQueryDate || new Date('2020-01-01')
			args.criteria.lastArticleId = args.criteria.lastArticleId || '000000000000000000000000'
			const selectedCategories = args.criteria.categories || categories
			args.criteria.nid = args.criteria.nid || ''

			const articlesByCategory = await Article.aggregate([
				{
					$match: {
						link: { $ne: null },
						modifiedDate: { $gt: new Date(args.criteria.lastQueryDate) },
						category: { $in: selectedCategories.map((c) => c.name) },
					},
				},
				{ $sort: { _id: -1 } },
				{
					$group: {
						_id: '$category',
						docs: { $push: '$$ROOT' },
					},
				},
				{
					$project: {
						latest: {
							$slice: ['$docs', 20],
						},
					},
				},
			])

			const articleFlattened = articlesByCategory.reduce(
				(accumulator, currentValue) => {
					const count = selectedCategories.find((c) => c.name == currentValue._id).count || 20
					currentValue.latest = currentValue.latest.slice(0, count)
					return { latest: accumulator.latest.concat(currentValue.latest) }
				},
				{ _id: '', latest: [] },
			)

			const articlesWithWeight = await calculateTotalWeights(articleFlattened.latest, args.criteria.nid)

			const articleWithSource = articlesWithWeight.map((article) => {
				const mySource = SourceConfig.find((x) => x.sourceName === article.sourceName)
				article.source = {
					_id: mySource.name,
					name: mySource.nepaliName,
					url: mySource.link,
					logoLink: process.env.SERVER_BASE_URL + mySource.logoLink,
				}
				return article
			})

			return articleWithSource
		},

		getArticle: async (parent, { _id }) => {
			const article = await Article.findById(_id).lean()

			if (article == null) {
				logger.warn(`Article Id ${_id} not found in db`)
				return null
			}

			const source = SourceConfig.find((x) => x.sourceName === article.sourceName)
			return {
				...article,
				source: { name: source.nepaliName, url: source.link, logoLink: process.env.SERVER_BASE_URL + source.logoLink },
			}
		},

		getIndividualArticles: async (parent, { name }) => {
			const articles = await Article.find({ tags: name }).lean().sort({ _id: -1 })
			const individualHandle = (await getTwitterHandles()).filter((x) => x.nepaliName == name)[0]
			let articleFlattened = _.flatten(articles)
			if (individualHandle) {
				const individualNewsCategories = individualHandle.newsCategories
				articleFlattened = articleFlattened.filter((x) => individualNewsCategories.includes(x.category)).slice(0, 20)
			}
			const articleList = articleFlattened.map((article) => {
				const mySource = SourceConfig.find((x) => x.sourceName === article.sourceName)
				article.source = {
					_id: mySource.name,
					name: mySource.nepaliName,
					url: mySource.link,
					logoLink: process.env.SERVER_BASE_URL + mySource.logoLink,
				}
				return article
			})
			return articleList
		},

		getArticlesFromTag: async (parent, { tag }) => {
			const articles = await Article.find({ tags: tag }).lean().sort({ _id: -1 }).limit(20)
			let articleFlattened = _.flatten(articles)
			const articleList = articleFlattened.map((article) => {
				const mySource = SourceConfig.find((x) => x.sourceName === article.sourceName)
				article.source = {
					_id: mySource.name,
					name: mySource.nepaliName,
					url: mySource.link,
					logoLink: process.env.SERVER_BASE_URL + mySource.logoLink,
				}
				return article
			})
			return articleList
		},

		getTweets: async (parent, args, { Tweet }) => {
			args.criteria = args.criteria || {}
			args.criteria.lastQueryDate = args.criteria.lastQueryDate || new Date('2001-01-01')
			args.criteria.lastTweetId = args.criteria.lastTweetId || '000000000000000000000000'

			const tweets = await Tweet.find().lean().sort({ publishedDate: -1 }).limit(100)
			const tweetsWithHandle = tweets.map((t) => {
				return { ...t, twitterHandle: { name: t.handle, handle: t.handle, _id: t._id } }
			})

			return tweetsWithHandle
		},

		getTweetByHandle: async (parent, { handle }) => {
			if (handle.charAt(0) !== '@') handle = '@' + handle
			const tweets = await Tweet.find({ handle }).sort({ publishedDate: -1 }).limit(100)
			return tweets
		},

		getLatestCoronaStats: async (parent, args, { CoronaStats }) => {
			const { CoronaDbService } = require('../db-service')
			return await CoronaDbService.getLatestStats()
		},

		getDistrictCoronaStats: async (parent, args, { DistrictCoronaStats }) => {
			const { DistrictCoronaDbService } = require('../db-service')
			return await DistrictCoronaDbService.getDistrictCoronaStats()
		},

		getTrending: async (parent, args, { TrendingTweetCount }) => {
			const { TrendingDbService } = require('./../db-service')
			return await TrendingDbService.getTrendingTweetCount()
		},

		getWeatherInfo: async (parent, args, { ipAddress }) => {
			try {
				if (ipAddress === '::1' || ipAddress === '::ffff:127.0.0.1') ipAddress = '27.111.16.0'
				logger.debug(`Printing ip: ${ipAddress}`)

				const weatherInfo = await getWeather(ipAddress)
				weatherInfo.ipAddress = ipAddress

				return {
					ipAddress: ipAddress,
					temperature: weatherInfo.main.temp,
					condition: weatherInfo.weather[0].main,
					description: weatherInfo.weather[0].description,
					place: weatherInfo.name,
				}
			} catch (error) {
				logger.error(`Error to getWeatherInfo for ip: ${ipAddress}`)
			}
		},

		getFmList: async (parent, args, { FM }) => {
			return fmDetails
		},

		getMyFavoriteFm: async (parent, { nid }) => {
			const myFavorites = await FavoriteFM.find({ nid })
			const myFavoriteFm = []
			myFavorites.forEach((favorite) => {
				const myFm = fmDetails.find((x) => x.id == favorite.fmId)
				myFm && myFavoriteFm.push(myFm)
			})
			return myFavoriteFm
		},

		getMyFm: async (parent, { nid }) => {
			const myFavorites = await FavoriteFM.find({ nid })
			const myFavoriteFm = []
			myFavorites.forEach((favorite) => {
				const myFm = fmDetails.find((x) => x.id == favorite.fmId)
				myFm && myFavoriteFm.push(myFm)
			})
			return {
				allFm: fmDetails,
				favoriteFm: myFavoriteFm,
			}
		},

		getNepaliEvent: (_, { date }) => {
			const year = date.slice(0, 4)
			const month = parseInt(date.slice(5, 7))

			const event = NepaliEvents.find((ne) => ne.year == year).events[month - 1].find((e) => e.bs == date)

			return { ...event, isHoliday: event.holiday }
		},

		getTrendingTags: async (parent, {}) => {
			const trendingTags = await trendingTagDbService.getTrendingTags()
			return trendingTags
		},

		getReadCategoryData: async (parent, args, {}) => {
			//this week
			const currentDate = new Date()
			let oneWeekBeforeDate = new Date()
			oneWeekBeforeDate.setDate(oneWeekBeforeDate.getDate() - 7) // one week before
			const weekData = await ReadArticle.find({
				'article.createdDate': {
					$lte: currentDate,
					$gte: oneWeekBeforeDate,
				},
			})

			let totalWeekArticles = []
			weekData.forEach((singleUser) => {
				const myArticle = singleUser.article || []
				const weekArticles = myArticle.filter((x) => x.createdDate <= currentDate && x.createdDate >= oneWeekBeforeDate)
				totalWeekArticles = totalWeekArticles.concat(weekArticles)
			})

			let weekStats = []
			categories.forEach((category) => {
				const myCatArticle = totalWeekArticles.filter((x) => x.category == category.name).length
				weekStats.push({
					category: category.name,
					data: myCatArticle,
				})
			})

			//this month
			let oneMonthBeforeDate = new Date()
			oneMonthBeforeDate.setMonth(oneMonthBeforeDate.getDate() - 30)
			const monthData = await ReadArticle.find({
				'article.createdDate': {
					$lte: currentDate,
					$gte: oneMonthBeforeDate,
				},
			})

			let totalMonthArticles = []
			monthData.forEach((singleUser) => {
				const myArticle = singleUser.article || []
				const monthArticles = myArticle.filter((x) => x.createdDate <= currentDate && x.createdDate >= oneMonthBeforeDate)
				totalMonthArticles = totalMonthArticles.concat(monthArticles)
			})

			let monthStats = []
			categories.forEach((category) => {
				const myCatArticle = totalMonthArticles.filter((x) => x.category == category.name).length
				monthStats.push({
					category: category.name,
					data: myCatArticle,
				})
			})

			return {
				weekStat: weekStats,
				monthStat: monthStats,
			}
		},
	},

	Mutation: {
		storeFcmToken: async (parent, args, { ipAddress }) => {
			const {
				input: { nid, fcmToken, countryCode, timeZone, createdDate, modifiedDate },
			} = args

			const response = await User.update(
				{ nid },
				{
					$set: {
						fcmToken,
						countryCode,
						timeZone,
						ipAddress,
						createdDate: createdDate || modifiedDate,
						modifiedDate: modifiedDate || createdDate,
					},
				},
				{ upsert: true },
			)

			return { success: !!response.ok }
		},

		saveFavorite: async (parent, args, {}) => {
			const {
				input: { nid, fmId },
			} = args

			const response = await FavoriteFM.update(
				{ nid, fmId },
				{
					$set: {
						nid,
						fmId,
					},
				},
				{ upsert: true },
			)

			return { success: !!response.ok }
		},

		deleteFavorite: async (parent, args, {}) => {
			const {
				input: { nid, fmId },
			} = args

			const response = await FavoriteFM.deleteOne({ nid, fmId })
			return { success: !!response.ok }
		},

		saveReadArticle: async (parent, args, {}) => {
			const {
				input: { nid, articles },
			} = args
			const savedReadArticles = await ReadArticle.findOne({ nid })
			if (savedReadArticles && savedReadArticles.nid) {
				let allArticles = savedReadArticles.article.concat(articles)
				allArticles = allArticles.map((article) => {
					return { articleId: article.articleId, category: article.category }
				})
				allArticles = allArticles.filter((thing, index, self) => index === self.findIndex((t) => t.articleId === thing.articleId))
				savedReadArticles.article = allArticles
				const response = await savedReadArticles.save()
				return { success: !!response.nid }
			} else {
				const readArticlesObj = new ReadArticle({ nid, article: articles })
				const response = await readArticlesObj.save()
				return { success: !!response.nid }
			}
		},

		postLike: async (parent, args, {}) => {
			const {
				input: { nid, articleId, category },
			} = args
			const myArticle = await Article.findOne({ _id: articleId })
			let likes = myArticle.likes || []
			likes.push({ nid })
			let dislikes = myArticle.dislikes || []
			dislikes = dislikes.filter((x) => x.nid != nid)
			myArticle.likes = likes
			myArticle.dislikes = dislikes
			await myArticle.save()

			await Like.insertMany([{ nid, articleId, category }])
			const response = await Dislike.deleteOne({ nid, articleId })
			return { success: !!response.ok }
		},

		removeLike: async (parent, args, {}) => {
			const {
				input: { nid, articleId },
			} = args
			const myArticle = await Article.findOne({ _id: articleId })
			let likes = myArticle.likes || []
			likes = likes.filter((x) => x.nid != nid)
			myArticle.likes = likes
			await myArticle.save()

			const response = await Like.deleteOne({ nid, articleId })
			return { success: !!response.ok }
		},

		postDislike: async (parent, args, {}) => {
			const {
				input: { nid, articleId, category },
			} = args
			const myArticle = await Article.findOne({ _id: articleId })
			let dislikes = myArticle.dislikes || []
			dislikes.push({ nid })
			let likes = myArticle.likes || []
			likes = likes.filter((x) => x.nid != nid)
			myArticle.likes = likes
			myArticle.dislikes = dislikes
			await myArticle.save()

			await Dislike.insertMany([{ nid, articleId, category }])
			const response = await Like.deleteOne({ nid, articleId })
			return { success: !!response.ok }
		},

		removeDislike: async (parent, args, {}) => {
			const {
				input: { nid, articleId },
			} = args
			const myArticle = await Article.findOne({ _id: articleId })
			let dislikes = myArticle.dislikes || []
			dislikes = dislikes.filter((x) => x.nid != nid)
			myArticle.dislikes = dislikes
			await myArticle.save()

			const response = await Dislike.deleteOne({ nid, articleId })
			return { success: !!response.ok }
		},
	},
}
