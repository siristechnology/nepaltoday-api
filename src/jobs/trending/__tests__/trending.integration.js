const TrendingJob = require('../index')
const { dbConnection } = require('../../../helper/connectionHelper')

jest.setTimeout(1200000)

beforeAll(async () => {
	await dbConnection()
})

describe('trending job', () => {
	it('integration test', async () => {
		await TrendingJob()
	})
})
