require('dotenv').config()
require('../../db-service/initialize')

const {
	Query: { getArticles },
} = require('../resolvers')

jest.setTimeout(20000)

describe('Resolvers Query getArticles Interation', () => {
	it('should return articles', async () => {
		const categories = [
			{ name: 'headline', count: 10 },
			{ name: 'politics', count: 10 },
			{ name: 'entertainment', count: 10 },
			{ name: 'news', count: 5 },
			{ name: 'business', count: 5 },
			{ name: 'sports', count: 10 },
			{ name: 'social', count: 5 },
		]
		const articles = await getArticles({}, { criteria: { categories } })

		expect(articles.length).toBe(45)
	})
})
