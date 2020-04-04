const mongoose = require('mongoose')
const { CoronaDbService } = require('../index')
require('../../config/env')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

describe('coronaDbService', () => {
	it('should save corona stats', async () => {
		const date1 = new Date(2001, 1, 1)
		const stats = {
			createdDate: date1,
			stats: [
				{
					country: 'Nepal',
					total_cases: 111,
					total_deaths: 11,
					new_cases: 22,
					new_deaths: 22,
				},
			],
		}

		await CoronaDbService.saveStats(stats)
	})
})
