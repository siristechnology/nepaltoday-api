const NewsCrawler = require('news-crawler')
const { dbConnection } = require('../../../helper/connectionHelper')
const url = require('../../../config/url')
const selector = require('../config/selector')
const sourceData = require('../../../config/source-data')
const { expectCt } = require('helmet')

jest.setTimeout(20000)

beforeAll(async () => {
	await dbConnection()
})

const getLinkSelector = (baseUrl) => {
	if(baseUrl==url.KANTIPUR){
		return selector.kantipur.LINK_SELECTOR
	}else if(baseUrl==url.RATOPATI){
		return selector.ratopati.LINK_SELECTOR	
	}else if(baseUrl==url.SETOPATI){
		return selector.setopati.LINK_SELECTOR	
	}else if(baseUrl==url.ONLINE_KHABAR){
		return selector.onlinekhabar.LINK_SELECTOR	
	}else if(baseUrl==url.BBC_NEPALI){
		return selector.bbcnepali.LINK_SELECTOR	
	}else if(baseUrl==url.SWASTHYA_KHABAR){
		return selector.swasthyakhabar.LINK_SELECTOR
	}
}

const getDetailSelector = (baseUrl) => {
	if(baseUrl==url.KANTIPUR){
		return selector.kantipur
	}else if(baseUrl==url.RATOPATI){
		return selector.ratopati
	}if(baseUrl==url.SETOPATI){
		return selector.setopati
	}if(baseUrl==url.ONLINE_KHABAR){
		return selector.onlinekhabar
	}if(baseUrl==url.BBC_NEPALI){
		return selector.bbcnepali
	}if(baseUrl==url.SWASTHYA_KHABAR){
		return selector.swasthyakhabar
	}
}

describe('NewsCrawlerTrigger integration', () => {
	it('Integration test', async () => {
		// await NewsCrawlerTrigger(console, { IsPastDue: false })
		const source = sourceData[0]
		const sourceName = source.name
		const baseUrl = source.link
		const logoLink = source.logoLink
		const category = source.category[0]
		const crawlTime = new Date()
		const url = `${baseUrl}${category.path}`
		let categoryPages = [{
			"url": url,
			"category": category.name,
			"link-selector": getLinkSelector(baseUrl)
		}]
		let sourceConfigs = [{
			pages: categoryPages,
			"article-detail-selectors": getDetailSelector(baseUrl),
			sourceName,
			logoLink,
			crawlTime
		}]
		let articles = await NewsCrawler(sourceConfigs, 1)
		expect(articles.length).toBeGreaterThan(0)
	})
})
