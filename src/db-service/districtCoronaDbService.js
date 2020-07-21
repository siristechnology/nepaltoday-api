const { DistrictCoronaStats } = require('./database/mongooseSchema')

module.exports = {
    saveDistrictStats: async (stats) => {
        return await DistrictCoronaStats.create(stats)
    },

    getDistrictStats: async () => {
        const districtStats = await DistrictCoronaStats.findOne({}, {}, { sort: { createdDate: -1 } }).lean()
        return districtStats
    }

}