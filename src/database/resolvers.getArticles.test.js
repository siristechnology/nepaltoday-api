const {
	resolver: {
		Query: { getArticles },
	},
} = require('./resolvers')
const { importSchema } = require('graphql-import')
const typeDefs = importSchema('src/database/typeDefs.graphql') /* Warning: Must be an absolute path */

// const ArticleMock = require('./mocks')

console.log('_______________article_______________', typeDefs)

describe('Resolvers Query getArticles', () => {
	it('should call Article.find for each category', () => {
		// const articles = await getArticles(ArticleMock)
		// expect(articles.length).toBeGreaterThan(0)

		console.log(getArticles)
	})
})
