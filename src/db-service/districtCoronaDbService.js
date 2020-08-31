const { DistrictCoronaStats } = require('./database/mongooseSchema')

module.exports = {
	saveDistrictStats: async (stats) => {
		return await DistrictCoronaStats.create(stats)
	},

	getDistrictCoronaStats: async () => {
		const districtStats = await DistrictCoronaStats.findOne({}, {}, { sort: { createdDate: -1 } }).lean()
		return districtStats
	},
}
