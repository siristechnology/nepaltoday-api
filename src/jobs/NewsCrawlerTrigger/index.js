const Bugsnag = require('@bugsnag/js')
const BugsnagPluginExpress = require('@bugsnag/plugin-express')
const NewsCrawler = require('news-crawler')
const { url } = require('./../../config/url')
const { selector } = require('./config/selector');
const { saveArticles } = require('../../db-service/newsDbService');

Bugsnag.start({
  apiKey: 'bf6ecbb87c478df6c456d6d297a82f4f',
  plugins: [BugsnagPluginExpress]
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

module.exports = async function (context) {
	let timeStamp = new Date().toISOString()
	const newsDbService = require('../../db-service/newsDbService')

	const ipAddress = require('ip').address()

	const getCategoryName = (category) => {
		if (category === 'news' || category === 'politics') {
			return 'news'
		} else {
			return category
		}
	}

	try {
		const sources = await newsDbService.getAllSources()
		if (sources) {
			let sourceConfigs = []
			for (const source of sources) {
				const sourceName = source.name
				const baseUrl = source.link
				const logoLink = source.logoLink
				const categories = source.category
				if (categories) {
					let categoryPages = []
					const crawlTime = new Date()
					for (const category of categories) {
						const categoryName = category.name
						const url = `${baseUrl}${category.path}`
						let page = {
							"url": url,
							"category": getCategoryName(categoryName),
							"link-selector": getLinkSelector(baseUrl)
						}
						categoryPages.push(page)
					}
					let sourceData = {
						pages: categoryPages,
						"article-detail-selectors": getDetailSelector(baseUrl),
						sourceName,
						logoLink,
						crawlTime
					}
					sourceConfigs.push(sourceData)
				}
			}
			let articles = await NewsCrawler(sourceConfigs, articleUrlLength = 3)
			articles.forEach(x=>x.hostIp=ipAddress)
			await saveArticles(articles)
		}
	} catch (error) {
		context.log('error occured here', error)
	}
	context.log('JavaScript timer trigger function ran!', timeStamp)
}