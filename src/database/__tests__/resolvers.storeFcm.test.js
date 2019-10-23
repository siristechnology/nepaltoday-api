const {
	resolver: {
		Mutation: { storeFcmToken },
	},
} = require('../resolvers')
import mockingoose from 'mockingoose'

import { GetMockArticle } from '../mocks'

describe('Resolvers Mutation storeFcmToken', () => {
	it('should create new fcm token on user collection', async () => {
		const { mongooseSchema } = require('nepaltoday-db-service')
		mockingoose(mongooseSchema.User).toReturn(
			null,
			(args = {
				input: {
					fcmToken: 'token123',
					countryCode: 'NEP',
				},
			}),
			'create',
		)

		const response = await storeFcmToken(null, {}, mongooseSchema)
		console.log('_______________response here_______________', response)

		expect(response.length).toBeGreaterThan(0)
	})
})
