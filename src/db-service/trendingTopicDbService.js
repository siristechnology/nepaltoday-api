const { TrendingTopic } = require('./database/mongooseSchema')

module.exports = {
    saveTrendingTopics: async(topics) =>{
        let oldDocument = await TrendingTopic.findOne({})
        if(oldDocument){
            let oldTopics = oldDocument.topics
            topics.forEach(topic=>{
                if(oldTopics.indexOf(topic) === -1) oldTopics.push(topic)
            })
            oldDocument.topics = oldTopics
            await oldDocument.save()
        }else{
            let trendingTopics = new TrendingTopic({topics})
            await trendingTopics.save()
        }
    }
}