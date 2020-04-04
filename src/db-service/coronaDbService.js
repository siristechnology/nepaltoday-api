const { CoronaStats } = require('./database/mongooseSchema')

module.exports = {
	saveStats: async (stats) => {
		return await CoronaStats.create(stats)
	},

	getLatestStats: async () => {
		const latestStats = await CoronaStats.findOne({}, {}, { sort: { createdDate: -1 } }).lean()
		return latestStats
	},
}
