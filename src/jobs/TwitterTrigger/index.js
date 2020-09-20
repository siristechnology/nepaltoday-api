const TweetDbService = require('../../db-service/TweetDbService')
const Twitter = require('twitter')
const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET } = require('../../config/env')
const logger = require('../../config/logger')

module.exports = async function () {
	try {
		const twitterHandles = await TweetDbService.getTwitterHandles()
		if (twitterHandles) {
			for (const user of twitterHandles) {
				await fetchTweetsAndSaveByHandle(user)
			}
		}
	} catch (error) {
		logger.error('Error fetching tweets:', { error })
	}
}

async function fetchTweetsAndSaveByHandle(user) {
	try {
		const handle = user.handle
		const tweets = await getUserTimeline(handle)
		if (tweets && tweets.length > 0) {
			saveTweets(tweets, user)
		} else {
			logger.info('No tweets from user: ', { handle: user.handle })
		}
	} catch (error) {
		logger.error('Error fetching tweets for user: ', { handle: user.handle, error: error })
	}
}

async function getUserTimeline(handle) {
	const client = new Twitter({
		consumer_key: TWITTER_CONSUMER_KEY,
		consumer_secret: TWITTER_CONSUMER_SECRET,
		access_token_key: TWITTER_ACCESS_TOKEN,
		access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
	})

	const params = {
		screen_name: `${handle}`,
		count: 10,
		exclude_replies: true,
		include_rts: false,
	}

	const rawTweets = await client.get('statuses/user_timeline', params)

	const tweets =
		rawTweets &&
		rawTweets.map((tweet) => ({
			publishedDate: tweet.created_at,
			tweetId: tweet.id_str || tweet.id,
			text: tweet.text,
			name: tweet.user.name,
			handle: `@${tweet.user.screen_name}`,
			description: tweet.user.description,
			profileImage: tweet.user.profile_image_url_https,
		}))

	return tweets
}

async function saveTweets(tweets, user) {
	const filterdTweets = Array.from(tweets).map((tweet) => {
		return {
			...tweet,
			twitterHandle: user._id,
		}
	})

	const savedTweets = await TweetDbService.saveTweets(filterdTweets)
	if (savedTweets) {
		logger.info('Tweets saved successfully')
	}
}
