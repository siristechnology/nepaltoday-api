require('dotenv').config()
const axios = require('axios')
const { CoronaDbService } = require('../../db-service')

module.exports = async function () {
	const response = await axios.get('https://pomber.github.io/covid19/timeseries.json')

	const countryMetrics = []
	let worldTotalCases = 0
	let worldTotalDeaths = 0
	let worldNewCases = 0
	let worldNewDeaths = 0
	Object.keys(response.data).forEach((country) => {
		const myData = response.data[country]
		const total_cases = myData[myData.length - 1].confirmed
		const total_deaths = myData[myData.length - 1].deaths
		const new_cases = myData[myData.length - 1].confirmed - myData[myData.length - 2].confirmed
		const new_deaths = myData[myData.length - 1].deaths - myData[myData.length - 2].deaths
		const countryMetric = {
			country,
			total_cases,
			total_deaths,
			new_cases,
			new_deaths,
		}
		worldTotalCases+=total_cases
		worldTotalDeaths+=total_deaths
		worldNewCases+=new_cases
		worldNewDeaths+=new_deaths
		countryMetrics.push(countryMetric)
	})

	const worldSummary = {
		totalCases: worldTotalCases,
		newCases: worldNewCases,
		totalDeaths: worldTotalDeaths,
		newDeaths: worldNewDeaths,
	}

	const coronaStats = {
		createdDate: new Date(),
		stats: countryMetrics,
		worldSummary: worldSummary,
		source: 'jhu.edu'
	}

	CoronaDbService.saveStats(coronaStats)

	return coronaStats
}
