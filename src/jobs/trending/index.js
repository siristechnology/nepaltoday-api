const TrendingDbService = require('../../db-service/trendingDbService')
const Twitter = require('twitter')
const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET } = require('../../config/env')

module.exports = async function () {
	const trendingHandles = await TrendingDbService.getTrendingHandles()
	const client = new Twitter({
		consumer_key: TWITTER_CONSUMER_KEY,
		consumer_secret: TWITTER_CONSUMER_SECRET,
		access_token_key: TWITTER_ACCESS_TOKEN,
		access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
	})
	if (trendingHandles) {
		for (const user of trendingHandles) {
			try{
				let searches = user.searchTerms
				searches.push(user.handle)
				let searchResultsArr = []
				for (const search of searches) {
					const params = {
						q: search,
						count: 100,
						result_type: 'recent',
					}
					const searchResults = await client.get('search/tweets', params)
					searchResultsArr = searchResultsArr.concat(searchResults.statuses)
					searchResultsArr = searchResultsArr.filter((thing, index, self) => index === self.findIndex((t) => t.id === thing.id))
				}
				const userInfo = await client.get('users/show.json', { screen_name: user.handle })
				const profileImage = userInfo.profile_image_url_https
				const d = new Date()
				d.setHours(0, 0, 0, 0)
				const midNightTimeStamp = d.getTime()
				const currentDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
				const recentTweetsCount = searchResultsArr.filter((x) => midNightTimeStamp < new Date(x.created_at).getTime()).length
				await TrendingDbService.saveTrendingTweetCount(currentDate, user.name, user.handle, recentTweetsCount, profileImage, user.category)
			}catch (error) {
				console.log('error in trending count', error)
			}
		}
		return
	}
}
