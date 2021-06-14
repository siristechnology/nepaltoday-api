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

		console.log('printing districtStats', districtStats)

		// const tagGroups = await Tag.find().lean()
		// expect(tagGroups.find((tg) => tg.tagId == 'tag1').currentMonthCount).toBe(4)
		// expect(tagGroups.find((tg) => tg.tagId == 'tag2').currentMonthCount).toBe(3)
		// expect(tagGroups.some((tg) => tg.tagId == '')).toBe(false)
	})
})
