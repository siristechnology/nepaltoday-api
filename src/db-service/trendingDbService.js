const { TrendingHandle, TrendingTweetCount } = require('./database/mongooseSchema')

module.exports = {
	saveTrendingHandles: async (stats) => {
		return await TrendingHandle.create(stats)
	},

	getTrendingHandles: async () => {
		return TrendingHandle.find()
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
				todayTrending.trendings = exceptCatFilter
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
		return await TrendingTweetCount.findOne({}, {}, { sort: { createdDate: -1 } }).lean()
	},
}
