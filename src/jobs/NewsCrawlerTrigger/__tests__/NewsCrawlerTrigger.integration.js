const NewsCrawler = require('news-crawler')
const { dbConnection } = require('../../../helper/connectionHelper')
const SourceConfig = require('../../../config/news-source-config.json')

jest.setTimeout(120000)

beforeAll(async () => {
	await dbConnection()
})

describe('NewsCrawlerTrigger integration', () => {
	it('Integration test', async () => {
		const articles = await NewsCrawler(SourceConfig.slice(0, 1), 1)
		console.log('printing articles', articles)
		expect(articles.length).toBeGreaterThan(0)
	})
})
