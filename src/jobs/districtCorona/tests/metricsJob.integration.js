require('../../../config/env')
require('../../../db-service/initialize.js')
const districtCoronaJob = require('../metricsJob')

jest.setTimeout(120000)

describe('District Corona Metrics Job integration', () => {
	it('should fetch district-wise stats from edcd.gov.np', async () => {
		await districtCoronaJob()
	})
})
