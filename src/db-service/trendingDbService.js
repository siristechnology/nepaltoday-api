const { TrendingTweetCount } = require('./database/mongooseSchema')
const { TrendingTwitterHandles } = require('./../config/twitter-handles')
const { trendingCategories } = require('../config/category')

module.exports = {
	getTrendingHandles: async () => {
		return TrendingTwitterHandles
	},

	saveTrendingTweetCount: async (date, name, handle, count, image, category) => {
		const todayTrending = await TrendingTweetCount.findOne({ createdDate: date })
		if (todayTrending) {
			const trendings = todayTrending.trendings
			const catFilter = trendings.filter((x) => x.category === category)
			const exceptCatFilter = trendings.filter((x) => x.category !== category)
			if (catFilter.length) {
				const counts = catFilter[0].counts
				let exceptTrending = counts.filter((x) => x.handle !== handle) || []
				exceptTrending.push({
					name,
					handle,
					count,
					image,
				})
				exceptTrending = exceptTrending.sort((a, b) => (a.count < b.count ? 1 : b.count < a.count ? -1 : 0))
				exceptCatFilter.push({
					category,
					counts: exceptTrending.slice(0, 5),
				})
				let sortedTrendings = []
				trendingCategories.forEach(iCategory=>{
					let myCategoryCount = exceptCatFilter.filter(x=>x.category==iCategory)
					if(myCategoryCount.length > 0){
						sortedTrendings.push(myCategoryCount[0])
					}
				})
				todayTrending.trendings = sortedTrendings
				const res = await todayTrending.save()
				return res
			} else {
				todayTrending.trendings.push({
					category,
					counts: [
						{
							name,
							handle,
							count,
							image,
						},
					],
				})
				let sortedTrendings = []
				trendingCategories.forEach(iCategory=>{
					let myCategoryCount = todayTrending.trendings.filter(x=>x.category==iCategory)
					if(myCategoryCount.length > 0){
						sortedTrendings.push(myCategoryCount[0])
					}
				})
				todayTrending.trendings = sortedTrendings
				const res = todayTrending.save()
				return res
			}
		} else {
			const trendingData = new TrendingTweetCount({
				createdDate: date,
				trendings: [
					{
						category: category,
						counts: [
							{
								name,
								handle,
								count,
								image,
							},
						],
					},
				],
			})

			const res = await trendingData.save()
			return res
		}
	},

	getTrendingTweetCount: async () => {
		const trendingTweetCount = await TrendingTweetCount.findOne({}, {}, { sort: { createdDate: -1 } }).lean()

		if (trendingTweetCount.trendings) {
			const trendingTweetCountWithOldModel = { ...trendingTweetCount, counts: [...trendingTweetCount.trendings[0].counts] }
			return trendingTweetCountWithOldModel
		} else {
			return trendingTweetCount
		}
	},
}
