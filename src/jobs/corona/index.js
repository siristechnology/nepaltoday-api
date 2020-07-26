require('dotenv').config()
const axios = require('axios')
const { CoronaDbService } = require('../../db-service')

module.exports = async function () {

	const response = await axios.get('https://pomber.github.io/covid19/timeseries.json')

	const worldSummaryResponse = await axios.get('https://data.nepalcorona.info/api/v1/world')

	let countryMetrics = []

	Object.keys(response.data).map(country=>{
		let myData = response.data[country]
		let total_cases = myData[myData.length-1].confirmed
		let total_deaths = myData[myData.length-1].deaths
		let new_cases = myData[myData.length-1].confirmed-myData[myData.length-2].confirmed
		let new_deaths = myData[myData.length-1].deaths-myData[myData.length-2].deaths
		let countryMetric = {
			country,
			total_cases,
			total_deaths,
			new_cases,
			new_deaths
		}
		countryMetrics.push(countryMetric)
	})

	let worldSummary = {
		totalCases: worldSummaryResponse.data.cases,
		newCases: worldSummaryResponse.data.todayCases,
		totalDeaths: worldSummaryResponse.data.deaths,
		newDeaths: worldSummaryResponse.data.todayDeaths
	}

	const coronaStats = {
		createdDate: new Date(),
		stats: countryMetrics,
		worldSummary: worldSummary
	}

	CoronaDbService.saveStats(coronaStats)
}
