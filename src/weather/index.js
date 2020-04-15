const geoIP = require('offline-geo-from-ip')
const axios = require('axios')
require('dotenv').config()

const getWeather = async (ipAddress) => {
	const locationInfo = geoIP.allData(ipAddress)

	const open_weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${locationInfo.location.latitude}&lon=${locationInfo.location.longitude}&appid=${process.env.OPEN_WEATHER_API_APPID}&units=metric`

	const weatherInfo = await axios(open_weather_url)
	return weatherInfo.data
}

module.exports = getWeather
