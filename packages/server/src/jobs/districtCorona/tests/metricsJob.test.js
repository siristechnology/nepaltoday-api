const TestDbServer = require('../../../db-service/tests/test-db-server.js')
const { DistrictCoronaStats } = require('../../../db-service/database/mongooseSchema')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const metrcisJob = require('../metricsJob')

describe('metrcisJob', () => {
	it('should fetch district-wise correctly', async () => {
		await metrcisJob()

		const districtStats = await DistrictCoronaStats.findOne({}, {}, { sort: { createdDate: -1 } }).lean()

		expect(districtStats.timeLine.totalCases).toBeGreaterThan(0)
		expect(districtStats.timeLine.newCases).toBeGreaterThan(0)
		expect(districtStats.timeLine.newDeaths).toBeGreaterThan(0)
	})
})
