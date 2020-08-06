const { PoliticianHandle, PoliticianTweetCount } = require('./database/mongooseSchema')

module.exports = {
    
    savePoliticianHandles: async (stats) => {
        return await PoliticianHandle.create(stats)
    },

    getPoliticianHandles: async () => {
        return PoliticianHandle.find()
    },

    savePoliticianTweetCount: async (handle,count) => {
        try{
            const countSaved = await PoliticianTweetCount.findOneAndUpdate({handle},{count})
            return countSaved
        }catch(error){
            console.log(error)
        }
    },

    getPoliticianTweetCount: async () => {
        return await PoliticianTweetCount.find({})
    }

}