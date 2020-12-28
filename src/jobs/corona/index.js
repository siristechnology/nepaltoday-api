require('dotenv').config()
const axios = require('axios')
const { CoronaDbService } = require('../../db-service')

module.exports = async function () {
	const response = await axios.get('https://pomber.github.io/covid19/timeseries.json')

	// const worldSummaryResponse = await axios.get('https://data.nepalcorona.info/api/v1/world')

	const countryMetrics = []

	let totalWorldCase = 0
	let totalWorldDeath = 0
	let newWorldCase = 0
	let newWorldDeath = 0

	Object.keys(response.data).forEach((country) => {
		const myData = response.data[country]
		const total_cases = myData[myData.length - 1].confirmed
		const total_deaths = myData[myData.length - 1].deaths
		const new_cases = myData[myData.length - 1].confirmed - myData[myData.length - 2].confirmed
		const new_deaths = myData[myData.length - 1].deaths - myData[myData.length - 2].deaths
		totalWorldCase+=total_cases
		totalWorldDeath+=total_deaths
		newWorldCase+=new_cases
		newWorldDeath+=new_deaths
		const countryMetric = {
			country,
			total_cases,
			total_deaths,
			new_cases,
			new_deaths,
		}
		countryMetrics.push(countryMetric)
	})

	const worldSummary = {
		totalCases: totalWorldCase,
		newCases: newWorldCase,
		totalDeaths: totalWorldDeath,
		newDeaths: newWorldDeath,
	}

	const coronaStats = {
		createdDate: new Date(),
		stats: countryMetrics,
		worldSummary: worldSummary,
		source: 'source: jhu.edu',
	}

	CoronaDbService.saveStats(coronaStats)

	return coronaStats
}
