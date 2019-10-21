const {
	resolver: {
		Query: { getArticles },
	},
} = require('./resolvers')

describe('Resolvers Query getArticles', () => {
	it('should call Article.find for each category', () => {
		console.log('Test getArticles here', getArticles)
	})
})
