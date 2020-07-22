require('dotenv').config()
const axios = require('axios')

const { DistrictCoronaDbService } = require('../../db-service')

module.exports = async function () {

    const districts = await axios.get('https://data.nepalcorona.info/api/v1/districts')

    const districtCoronaStats = await axios.get('https://data.nepalcorona.info/api/v1/covid/summary')

    let districtMetrics = []

    districts.data.forEach(district=>{

        let totalCases = districtCoronaStats.data.district.cases.filter(x=>x.district==district.id)[0]
        let activeCases = districtCoronaStats.data.district.active.filter(x=>x.district==district.id)[0]
        let recovered = districtCoronaStats.data.district.recovered.filter(x=>x.district==district.id)[0]
        let deaths = districtCoronaStats.data.district.deaths.filter(x=>x.district==district.id)[0]
        let districtMetric = {
            name: district.title,
            totalCases: totalCases && totalCases.count && totalCases.count || 0,
            activeCases: activeCases && activeCases.count && activeCases.count || 0,
            recovered: recovered && recovered.count && recovered.count || 0,
            deaths: deaths && deaths.count && deaths.count || 0,
        }

        districtMetrics.push(districtMetric)
    })

    const toSaveStats = {
        createdDate: new Date(),
        districts: districtMetrics
    }

    DistrictCoronaDbService.saveDistrictStats(toSaveStats)

}