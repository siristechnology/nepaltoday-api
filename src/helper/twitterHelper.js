const { sortArrayByWeight } = require('../utils/arrayUtil')
const getSortedTweets = (tweets = []) => {
	const mappedTweets = tweets.map((tweet) => {
		const weight = Number(tweet.twitterHandle.userWeight) + Number(tweet.twitterHandle.categoryWeight)
		tweet.weight = weight
		return tweet
	})

	const sortedTweets = sortArrayByWeight(mappedTweets)
	return sortedTweets
}

module.exports = {
	getSortedTweets,
}
