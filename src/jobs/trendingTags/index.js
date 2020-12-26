const { TrendingTopic, Article } = require("../../db-service/database/mongooseSchema")
const trendingTagDbService = require("../../db-service/trendingTagDbService")

module.exports = async function(){
    try{
        const trendingTopics = await TrendingTopic.find()
        let trendingTopicList = []
        for(const topic of trendingTopics[0].topics){
            const result = await Article.find({
                tags: topic
            })
            trendingTopicList.push({topic, length: result.length})
        }
        trendingTopicList = trendingTopicList.sort((a,b) => (a.length < b.length) ? 1 : ((b.length < a.length) ? -1 : 0))
        trendingTopicList = trendingTopicList.slice(0, 5)
        const tags = trendingTopicList.map(topic=>topic.topic)
        await trendingTagDbService.saveTrendingTags(tags)
    }catch(error){
        console.log("error", error)
    }
}