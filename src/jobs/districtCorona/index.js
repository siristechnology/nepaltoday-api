require('dotenv').config()
const axios = require('axios')

const { DistrictCoronaDbService } = require('../../db-service')

module.exports = async function () {

    console.log(' I m here')

    const districts = await axios.get('https://data.nepalcorona.info/api/v1/districts')

    console.log("distiche here",districts)

    const districtCoronaStats = await axios.get('https://data.nepalcorona.info/api/v1/covid/summary')

    let districtMetrics = []

    (districts || []).forEach(district=>{

        let districtMetric = {
            name: district.title,
            totalCases: districtCoronaStats.district.cases.filter(x=>x.district==district.id)[0].count,
            activeCases: districtCoronaStats.district.active.filter(x=>x.district==district.id)[0].count,
            recovered: districtCoronaStats.district.recovered.filter(x=>x.district==district.id)[0].count,
            deaths: districtCoronaStats.district.deaths.filter(x=>x.district==district.id)[0].count,
        }

        districtMetrics.push(districtMetric)
    })

    const toSaveStats = {
        createdDate: new Date(),
        stats: districtMetrics
    }

    DistrictCoronaDbService.saveDistrictStats(toSaveStats)

}