import getWeather from '../index'
require('dotenv').config()

describe('getWeather', () => {
	it('should return weather', async () => {
		const weatherInfo = await getWeather('2603:900a:1103:a300:1800:16f1:b2ec:c87c')

		expect(weatherInfo.name).toBe('Marion')
		expect(weatherInfo.main.temp).not.toBeNull()
	})
})
