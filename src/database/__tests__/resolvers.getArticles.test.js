const {
	resolver: {
		Query: { getArticles },
	},
} = require('../resolvers')
// const mongoose = require('mongoose')
// const Mockgoose = require('mock-mongoose').Mockgoose
// const mockgoose = new Mockgoose(mongoose)
import mockingoose from 'mockingoose'

// const { importSchema } = require('graphql-import')
// const typeDefs = importSchema('src/database/typeDefs.graphql') /* Warning: Must be an absolute path */

import { GetMockArticle } from './mocks'

describe('Resolvers Query getArticles', () => {
	// beforeAll(function(done) {
	// 	mockgoose.prepareStorage().then(function() {
	// 		mongoose.connect('mongodb://example.com/TestingDB', function(err) {
	// 			done(err)
	// 		})
	// 	})
	// })

	it('should call Article.find for each category', async () => {
		const { mongooseSchema } = require('nepaltoday-db-service')
		mongooseSchema.Article.schema.path('source', Object)
		mockingoose(mongooseSchema.Article).toReturn([GetMockArticle(), GetMockArticle()], 'find')

		const articles = await getArticles(null, {}, mongooseSchema)

		expect(articles.length).toBeGreaterThan(0)
	})
})
