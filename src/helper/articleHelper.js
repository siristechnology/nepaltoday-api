const { sources } = require('../config/source')
const { weights } = require('../config/weight')
const { en } = require('../lang/en')
const { sortArrayByWeight } = require('../utils/arrayUtil')

const getSourceWeight = source => {
	switch (source) {
		case sources.EKANTIPUR:
			return weights.source.EKANTIPUR
		case sources.SETOPATI:
			return weights.source.SETOPATI
		case sources.RATOPATI:
			return weights.source.RATOPATI
		case sources.DAINIK:
			return weights.source.DAINIK
		default:
			return 50
	}
}

const getCategoryWeight = category => {
	switch (category) {
		case en.category.NEWS:
			return weights.category.NEWS
		case en.category.POLITICS:
			return weights.category.POLITICS
		case en.category.BUSINESS:
			return weights.category.BUSINESS
		case en.category.SOCIAL:
			return weights.category.SOCIAL
		case en.category.SPORTS:
			return weights.category.SPORTS
		case en.category.ENTERTAINMENT:
			return weights.category.ENTERTAINMENT
		case en.category.OPINION:
			return weights.category.OPINION
		default:
			return 50
	}
}
const getSortedArticle = (articles = []) => {
	const mappedArticle = articles.map(article => {
		const sourceWeight = getSourceWeight(article.source.link)
		const categoryWeight = getCategoryWeight(article.category)
		const weight = sourceWeight + categoryWeight + Number(article.publishedDate)
		article.weight = weight
		return article
	})

	const sortedArticles = sortArrayByWeight(mappedArticle)

	return sortedArticles
}

module.exports = {
	getSortedArticle,
	getSourceWeight,
	getCategoryWeight,
}
