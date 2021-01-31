const mongoose = require('mongoose')
require('../../../config/env')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const districtCoronaJob = require('../metricsJob')

jest.setTimeout(120000)

describe('District Corona Metrics Job integration', () => {
	it('should fetch district-wise stats from edcd.gov.np', async () => {
		await districtCoronaJob()
	})
})
