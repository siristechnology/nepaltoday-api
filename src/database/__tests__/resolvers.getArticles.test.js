const {
	resolver: {
		Query: { getArticles },
	},
} = require('../resolvers')
import mockingoose from 'mockingoose'

import { GetMockArticle } from '../mocks'

describe('Resolvers Query getArticles', () => {
	it('should call Article.find for each category', async () => {
		const { mongooseSchema } = require('nepaltoday-db-service')
		mongooseSchema.Article.schema.path('source', Object)
		mockingoose(mongooseSchema.Article).toReturn([GetMockArticle(), GetMockArticle()], 'find')

		const articles = await getArticles(null, {}, mongooseSchema)

		expect(articles.length).toBeGreaterThan(0)
	})
})
