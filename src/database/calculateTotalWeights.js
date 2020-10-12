const moment = require('moment')

const calculateTotalWeights = (articles) => {
	return articles.map((article) => {
		article.weights = article.weights || {}
		article.weights.date = getDateWeight(article.publishedDate)
		article.totalWeight = article.weights.source + article.weights.category + article.weights.date
		article.totalWeight = isNaN(article.totalWeight) ? 0 : article.totalWeight
		return article
	})
}

const getDateWeight = (date) => {
	const now = moment.utc()
	const end = moment(date)
	const duration = moment.duration(now.diff(end))
	const diffMins = duration.asMinutes()

	if (diffMins < 60) {
		return 10
	} else if (diffMins < 4 * 60) {
		return 9
	} else if (diffMins < 24 * 60) {
		return 8
	} else {
		return 7
	}
}

module.exports = { calculateTotalWeights }
