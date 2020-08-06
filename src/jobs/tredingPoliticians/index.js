const TredingPoliticiansDbService = require('./../../db-service/trendingPoliticiansDbService')
const Twitter = require('twitter')
const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET } = require('./../../config/env')

module.exports = async function() {
    try{
        const politicianHandles = await TredingPoliticiansDbService.getPoliticianHandles()
        const client = new Twitter({
            consumer_key: TWITTER_CONSUMER_KEY,
            consumer_secret: TWITTER_CONSUMER_SECRET,
            access_token_key: TWITTER_ACCESS_TOKEN,
            access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
        })
        if(politicianHandles){
            for( const user of politicianHandles){
                let searches = user.searchTerms
                let searchResultsArr = []
                for(const search of searches){
                    const params = {
                        q: search,
                        count: 100,
                        result_type: 'recent'
                    }
                    const searchResults = await client.get('search/tweets', params)
                    searchResultsArr = searchResultsArr.concat(searchResults.statuses)
                    searchResultsArr = searchResultsArr.filter((thing, index, self) =>
                        index === self.findIndex((t) => (
                            t.id === thing.id
                        ))
                    )
                }
                
                let d = new Date();
                d.setHours(0,0,0,0);
                let midNightTimeStamp = d.getTime()
                let recentTweetsCount = searchResultsArr.filter(x=>midNightTimeStamp<(new Date(x.created_at)).getTime()).length
                await TredingPoliticiansDbService.savePoliticianTweetCount(user.handle,recentTweetsCount)
            }   
            return

        }
    }catch(error){
        console.log("error in trending politiciain",error)
    }
}