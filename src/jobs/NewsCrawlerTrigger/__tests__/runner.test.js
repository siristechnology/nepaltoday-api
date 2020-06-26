const jobRunner = require('../runner')
const TestDbServer = require('../../../db-service/tests/test-db-server')
const { Source } = require('../../../db-service/database/mongooseSchema')

jest.setTimeout(120000)

beforeAll(async () => await TestDbServer.connect())
afterAll(async () => await TestDbServer.closeDatabase())

describe('NewsCrawlerTrigger runner integration', () => {
	it('Integration test', async (done) => {
		const dainikSource = {
			_id: '5ec487682d8bdd525e003c86',
			name: 'दैनिक नेपाल',
			link: 'https://www.dainiknepal.com',
			logoLink: '/assets/logos/dainik.png',
			category: [
				{ name: 'news', path: '/section/latest-news' },
				{ name: 'opinion', path: '/section/views' },
				{ name: 'sports', path: '/section/sports' },
				{ name: 'entertainment', path: '/section/kala' },
				{ name: 'business', path: '/section/market' },
			],
		}
		await Source.create(dainikSource)

		await jobRunner()

		done()
	})
})
