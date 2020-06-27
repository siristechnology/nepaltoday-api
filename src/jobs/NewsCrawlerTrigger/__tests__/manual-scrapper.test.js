const nock = require('nock')
const manualScrapper = require('../manual-scrapper')
const { selector } = require('../config/selector')

describe('manual-scrapper unit test', () => {
	it('manualScrapper should scrape ekantipur link', async () => {
		const link = 'https://ekantipur.com/bibidha/2019/09/10/156811002238917391.html'
		const logoLink = 'default logoLink'
		const mockContent =
			'<html><body><div><article><div class="article-header"><h1>सबै मिलेर आत्महत्या रोकथाम गरौं</h1></div></article></div></body></html>'
		nock('https://ekantipur.com').get('/bibidha/2019/09/10/156811002238917391.html').reply(200, mockContent)

		const { error, data } = await manualScrapper(link, logoLink, selector.kantipur)

		expect(data.title.length).toBeGreaterThan(0)
		expect(error).toBeFalsy()
	})
})
