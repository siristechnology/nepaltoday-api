const TestDbServer = require('../../db-service/tests/test-db-server.js')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const {
	Query: { getArticles },
} = require('../resolvers')

describe('Resolvers Query getArticles', () => {
	it('should return articles', async () => {
		const articles = await getArticles({}, {})

		console.log('printing articles', articles)
		expect(articles.length).toBe(0)
	})
})
