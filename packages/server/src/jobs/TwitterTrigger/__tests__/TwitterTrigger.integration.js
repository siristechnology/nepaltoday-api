const twitterJob = require('../index')
require('../../../db-service/initialize')

jest.setTimeout(20000)

describe('Run Twitter fetch job', () => {
	it('start', async () => {
		console.log('Running twitterJob')
		await twitterJob()
	})
})
