import { scrapeNewsLink } from '../linkCrawler'

describe('link-crawler integration test', () => {
	it('link-crawler should crawl setopati link', async () => {
		const baseUrl = 'https://setopati.com'
		const url = 'https://setopati.com/sports'
		const { error, links } = await scrapeNewsLink(baseUrl, url)
		expect(links).not.toBe(null)
		expect(error).toBeFalsy()
	})
	it('link-crawler should crawl ekantipur link', async () => {
		const baseUrl = 'https://ekantipur.com'
		const url = 'https://ekantipur.com/news'
		const { error, links } = await scrapeNewsLink(baseUrl, url)
		expect(links).not.toBe(null)
		expect(error).toBeFalsy()
	})
	it('link-crawler should crawl dainikhabar link', async () => {
		const baseUrl = 'https://dainiknepal.com'
		const url = 'https://www.dainiknepal.com/section/latest-news'
		const { error, links } = await scrapeNewsLink(baseUrl, url)
		expect(links).not.toBe(null)
		expect(error).toBeFalsy()
	})
	it('link-crawler should crawl ratopati link', async () => {
		const baseUrl = 'https://ratopati.com'
		const url = 'https://ratopati.com'
		const { error, links } = await scrapeNewsLink(baseUrl, url)
		expect(links).not.toBe(null)
		expect(error).toBeFalsy()
	})
	it('link-crawler should crawl onlinekhabar link', async () => {
		const baseUrl = 'https://onlinekhabar.com'
		const url = 'https://onlinekhabar.com/business'

		const { error, links } = await scrapeNewsLink(baseUrl, url)
		expect(links).not.toBe(null)
		expect(error).toBeFalsy()
	})
})
