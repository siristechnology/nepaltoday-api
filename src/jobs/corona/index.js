require('dotenv').config()
const axios = require('axios')
const { CoronaDbService } = require('../../db-service')

const defaultCountries = ['Nepal', 'India', 'US', 'Spain', 'Italy', 'Germany', 'France', 'China', 'Iran', 'United Kingdom', 'Australia', 'Ireland']

module.exports = async function(selectedCountries) {
	selectedCountries = selectedCountries || defaultCountries

	const response = await axios.get('https://pomber.github.io/covid19/timeseries.json')

	let countryMetrics = []

	selectedCountries.forEach((country) => {
		const countryData = response.data[country]

		if (countryData) {
			const countryMetric = {
				country: country,
				total_cases: countryData[countryData.length - 1]['confirmed'],
				total_deaths: countryData[countryData.length - 1]['deaths'],
				new_cases: countryData[countryData.length - 1]['confirmed'] - countryData[countryData.length - 2]['confirmed'],
				new_deaths: countryData[countryData.length - 1]['deaths'] - countryData[countryData.length - 2]['deaths'],
			}

			countryMetrics.push(countryMetric)
		}
	})

	const coronaStats = {
		createdDate: new Date(),
		stats: countryMetrics,
	}

	CoronaDbService.saveStats(coronaStats)
}
