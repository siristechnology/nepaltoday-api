const {
	resolver: {
		Mutation: { storeFcmToken },
	},
} = require('../resolvers')
import mockingoose from 'mockingoose'

describe('Resolvers Mutation storeFcmToken', () => {
	it('should create new fcm token on user collection', async () => {
		const { mongooseSchema } = require('nepaltoday-db-service')
		mockingoose(mongooseSchema.User).toReturn(
			{
				fcmToken: 'token123',
				countryCode: 'NEP',
			},
			'create',
		)

		const response = await storeFcmToken(
			null,
			{
				input: {
					fcmToken: 'token123',
					countryCode: 'NEP',
				},
			},
			mongooseSchema,
		)
		console.log('_______________response here_______________', response)

		expect(response).toBeDefined()
	})
})
