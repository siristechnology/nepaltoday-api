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
		const { today } = await axiosInstance.get('https://portal.edcd.gov.np/covid19/dataservice/data-dev.php').then(({ data }) => data)

		const totalCasesDetail = await axiosInstance
			.get(`https://portal.edcd.gov.np/covid19/dataservice/data-dev.php?sDate=2020-01-01&eDate=${today}&disease=COVID-19`)
			.then(({ data }) => data)
		const totalCases = totalCasesDetail.reduce((a, c) => a + parseInt(c.Value), 0)

		const newCasesDetail = await axiosInstance
			.get(`https://portal.edcd.gov.np/covid19/dataservice/data-dev.php?sDate=${today}&eDate=${today}&disease=COVID-19`)
			.then(({ data }) => data)
		const totalNewCases = newCasesDetail.reduce((a, c) => a + parseInt(c.Value), 0)

		const deathsSummary = await axiosInstance
			.get(`https://portal.edcd.gov.np/covid19/dataservice/data-dev.php?type=outcome&sDate=2020-01-01&eDate=${today}&disease=COVID-19`)
			.then(({ data }) => data)
		const totalDeaths = deathsSummary.reduce((a, c) => a + parseInt(c['Number of deaths']) * parseInt(c.Value), 0)

		const newDeathSummary = await axiosInstance
			.get(`https://portal.edcd.gov.np/covid19/dataservice/data-dev.php?type=outcome&sDate=${today}&eDate=${today}&disease=COVID-19`)
			.then(({ data }) => data)
		const newDeaths = newDeathSummary.length > 0 ? parseInt(newDeathSummary[0]['Number of deaths']) : 0

		const coronaTimeLine = {
			totalCases,
			newCases: totalNewCases,
			totalDeaths,
			newDeaths,
		}

		const districtMetrics = []

		districts.forEach((district) => {
			const districtTotalCases = totalCasesDetail
				.filter((s) => s.District.toLowerCase().includes(district.title.toLowerCase()))
				.reduce((a, c) => a + parseInt(c.Value), 0)

			const districtNewCases = newCasesDetail
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
