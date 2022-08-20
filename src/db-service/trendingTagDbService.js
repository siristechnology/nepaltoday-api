const { TrendingTag } = require('./database/mongooseSchema')

module.exports = {
    saveTrendingTags: async(tags) => {
        const oldDocument = await TrendingTag.findOne({})
        if(oldDocument){
            oldDocument.tags = tags
            await oldDocument.save()
        }else{
            const tagsObj = new TrendingTag({tags})
            await tagsObj.save()
        }
    },

    getTrendingTags: async() => {
        const tags = await TrendingTag.findOne({}, {}, { sort: { createdDate: -1 } }).lean()
        return tags
    }
}