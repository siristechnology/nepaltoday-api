const NewsCrawlerTrigger = require('../index')
const { dbConnection } = require('../../../helper/connectionHelper')

jest.setTimeout(20000)

beforeAll(async () => {
	await dbConnection()
})

describe('NewsCrawlerTrigger integration', () => {
	it('Integration test', async () => {
		await NewsCrawlerTrigger(console, { IsPastDue: false })
	})
})
