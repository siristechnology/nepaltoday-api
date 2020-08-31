require('dotenv').config()
const axios = require('axios')
const { CoronaDbService } = require('../../db-service')

module.exports = async function () {
	const response = await axios.get('https://pomber.github.io/covid19/timeseries.json')

	const worldSummaryResponse = await axios.get('https://data.nepalcorona.info/api/v1/world')

	const countryMetrics = []

	Object.keys(response.data).forEach((country) => {
		const myData = response.data[country]
		const totalCases = myData[myData.length - 1].confirmed
		const totalDeaths = myData[myData.length - 1].deaths
		const newCases = myData[myData.length - 1].confirmed - myData[myData.length - 2].confirmed
		const newDeaths = myData[myData.length - 1].deaths - myData[myData.length - 2].deaths
		const countryMetric = {
			country,
			totalCases,
			totalDeaths,
			newCases,
			newDeaths,
		}
		countryMetrics.push(countryMetric)
	})

	const worldSummary = {
		totalCases: worldSummaryResponse.data.cases,
		newCases: worldSummaryResponse.data.todayCases,
		totalDeaths: worldSummaryResponse.data.deaths,
		newDeaths: worldSummaryResponse.data.todayDeaths,
	}

	const coronaStats = {
		createdDate: new Date(),
		stats: countryMetrics,
		worldSummary: worldSummary,
	}

	CoronaDbService.saveStats(coronaStats)
}
