const NewsCrawlerTrigger = require('../index')
const { dbConnection } = require('../../../helper/connectionHelper')

jest.setTimeout(120000)

beforeAll(async () => {
	await dbConnection()
})

describe('NewsCrawlerTrigger', () => {
	it('integration test', async () => {
		await NewsCrawlerTrigger()
	})
})
