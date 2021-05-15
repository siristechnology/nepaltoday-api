const NewsCrawler = require('news-crawler')
const SourceConfig = require('../../../config/news-source-config.json')

jest.setTimeout(120000)

describe('news-crawler', () => {
	it('Bizmandu can be scraped', async () => {
		const source = SourceConfig.filter((s) => s.name === 'Bizmandu' && s.pages.some((p) => p.category === 'business'))

		const articles = await NewsCrawler(source, 2)

		console.log('printing articles', articles)

		expect(articles.length).toBeGreaterThan(0)
	})
})
