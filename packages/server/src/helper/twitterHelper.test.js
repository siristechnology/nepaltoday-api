const { getSortedTweets } = require('./twitterHelper')
const data = [
	{
		_id: 101,
		text: 'मेरो भनाइ “संविधान दिवसको दिन दीपावली पनि नगर्ने र कालो दिनका रूपमा पनि नमनाउने” हो! अन्यथा छापिएकोमा दु:ख व्यक्त ग… ',
		name: 'Baburam Bhattarai',
		twitterHandle: {
			_id: '5d812b1ccbda5eb8c6e3dc2b',
			handle: '@brb1954',
			name: 'Dr. Baburam Bhattarai',
			userWeight: 15,
			categoryWeight: 50,
			category: 'POLITICS',
		},
	},

	{
		_id: 102,
		text: 'second article',
		name: 'Damuram Bhattarai',
		twitterHandle: {
			_id: '5d812b1ccbda5eb8c6e3dc2b',
			handle: '@brb1954',
			name: 'Dr. Damuram Bhattarai',
			userWeight: 16,
			categoryWeight: 50,
			category: 'POLITICS',
		},
	},
]

describe('Sort Tweets by weight', () => {
	it('sort tweet by weight', () => {
		const sortedTweets = getSortedTweets(data)
		expect(sortedTweets[0]._id).toBe(102)
	})
})
