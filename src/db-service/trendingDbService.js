const { TrendingHandle, TrendingTweetCount } = require('./database/mongooseSchema')

module.exports = {
    
    saveTrendingHandles: async (stats) => {
        return await TrendingHandle.create(stats)
    },

    getTrendingHandles: async () => {
        return TrendingHandle.find()
    },

    saveTrendingTweetCount: async (date,name,handle,count,image) => {
        let todayTrending = await TrendingTweetCount.findOne({createdDate:date})
        if(todayTrending){
            let newTrendingArr = todayTrending.counts
            let exceptTrending = newTrendingArr.filter(x=>x.handle!=handle) || []
            exceptTrending.push({
                name,
                handle,
                count,
                image
            })
            exceptTrending = exceptTrending.sort((a,b)=>(a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0))
            todayTrending.counts = exceptTrending
            let res = await todayTrending.save()
            return res
        }else{
            let trendingData = new TrendingTweetCount({
                createdDate: date,
                counts: [{
                    name,
                    handle,
                    count,
                    image
                }]
            })
            let res = await trendingData.save()
            return res
        }   
    },

    getTrendingTweetCount: async () => {
        return await TrendingTweetCount.findOne({}, {}, { sort: { createdDate: -1 } }).lean()
    }

}