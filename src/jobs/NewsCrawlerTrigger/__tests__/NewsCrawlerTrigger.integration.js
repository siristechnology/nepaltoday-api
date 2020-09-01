const NewsCrawlerTrigger = require('../index')

jest.setTimeout(120000)

describe('NewsCrawlerTrigger', () => {
	it('integration test', async () => {
		await NewsCrawlerTrigger()
	})
})
