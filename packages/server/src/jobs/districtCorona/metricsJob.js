require('dotenv').config()
const axios = require('axios')
const https = require('https')
const { DistrictCoronaDbService } = require('../../db-service')
const logger = require('../../config/logger')
const districts = require('./districts.json')

const axiosInstance = axios.create({
	httpsAgent: new https.Agent({
		rejectUnauthorized: false,
	}),
	headers: {
		Referer: 'https://portal.edcd.gov.np/covid19/',
	},
})
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

module.exports = async function () {
	try {
		const { today, yesterday } = await axiosInstance.get('https://portal.edcd.gov.np/covid19/dataservice/data-dev.php').then(({ data }) => data)

		const { totalCases, totalCasesDetail } = await fetchTotalCases(today)
		const newCases = await fetchNewCases(today, yesterday)
		const totalDeaths = await fetchTotalDeaths(today)
		const newDeaths = await fetchNewDeaths(today, yesterday)

		const coronaTimeLine = {
			totalCases,
			newCases: newCases.total,
			totalDeaths,
			newDeaths,
		}

		const districtMetrics = []

		districts.forEach((district) => {
			const districtTotalCases = totalCasesDetail
				.filter((s) => s.District.toLowerCase().includes(district.title.toLowerCase()))
				.reduce((a, c) => a + parseInt(c.Value), 0)

			const districtNewCases = newCases.detail
				.filter((s) => s.District.toLowerCase().includes(district.title.toLowerCase()))
				.reduce((a, c) => a + parseInt(c.Value), 0)

			const districtMetric = {
				name: district.title_en,
				nepaliName: district.title_ne,
				totalCases: districtTotalCases || 0,
				newCases: districtNewCases || 0,
			}

			districtMetrics.push(districtMetric)
		})

		const stats = {
			createdDate: new Date(),
			timeLine: coronaTimeLine,
			districts: districtMetrics,
			source: 'source: edcd.gov.np',
		}

		await DistrictCoronaDbService.saveDistrictStats(stats)

		logger.info(`Nepal Corona metrics job ran! Metrics: ${JSON.stringify(stats.timeLine)}`, { date: new Date().toISOString() })
	} catch (error) {
		logger.error('Error in national corona stats:', error)
	}
}

async function fetchTotalCases(today) {
	const totalCasesDetail = await axiosInstance
		.get(`https://portal.edcd.gov.np/covid19/dataservice/data-dev.php?sDate=2020-01-01&eDate=${today}&disease=COVID-19`)
		.then(({ data }) => data)
	const totalCases = totalCasesDetail.reduce((a, c) => a + parseInt(c.Value), 0)
	return { totalCases, totalCasesDetail }
}

async function fetchNewCases(today, yesterday) {
	let newCases = await fetchNewCasesForGivenDay(today)

	if (newCases.total == 0) {
		newCases = await fetchNewCasesForGivenDay(yesterday)
	}
	return newCases
}

async function fetchNewCasesForGivenDay(currentDay) {
	let detail = await axiosInstance
		.get(`https://portal.edcd.gov.np/covid19/dataservice/data-dev.php?sDate=${currentDay}&eDate=${currentDay}&disease=COVID-19`)
		.then(({ data }) => data)
	let total = detail.reduce((a, c) => a + parseInt(c.Value), 0)
	return { total, detail }
}

async function fetchTotalDeaths(today) {
	const deathsSummary = await axiosInstance
		.get(`https://portal.edcd.gov.np/covid19/dataservice/data-dev.php?type=outcome&sDate=2020-01-01&eDate=${today}&disease=COVID-19`)
		.then(({ data }) => data)
	const totalDeaths = deathsSummary.reduce((a, c) => a + parseInt(c['Number of deaths']) * parseInt(c.Value), 0)
	return totalDeaths
}

async function fetchNewDeaths(today, yesterday) {
	let newDeaths = await fetchNewDeathsForGivenDay(today)

	if (newDeaths == 0) {
		newDeaths = await fetchNewDeathsForGivenDay(yesterday)
	}
	return newDeaths
}

async function fetchNewDeathsForGivenDay(currentDay) {
	const newDeathSummary = await axiosInstance
		.get(`https://portal.edcd.gov.np/covid19/dataservice/data-dev.php?type=outcome&sDate=${currentDay}&eDate=${currentDay}&disease=COVID-19`)
		.then(({ data }) => data)
	const newDeaths = newDeathSummary.length > 0 ? parseInt(newDeathSummary[0]['Number of deaths']) : 0
	return newDeaths
}
