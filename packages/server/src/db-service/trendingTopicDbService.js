const { TrendingTwitterHandles } = require('../config/twitter-handles')
const { TrendingTopic } = require('./database/mongooseSchema')

module.exports = {
    saveTrendingTopics: async(topics) =>{
        const twitterTopics = TrendingTwitterHandles.map(handle=> handle.nepaliName)
        topics = topics.concat(twitterTopics)
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