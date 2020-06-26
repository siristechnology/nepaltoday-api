const { CoronaDbService } = require('../index')
const TestDbServer = require('./test-db-server')

jest.setTimeout(120000)

beforeAll(async () => await TestDbServer.connect())
afterAll(async () => await TestDbServer.closeDatabase())

describe('coronaDbService', () => {
	it('should get latest saved corona stats', async () => {
		const stats1 = generateDummyStats(new Date('Jan 01 2001 UTC'))
		await CoronaDbService.saveStats(stats1)

		const stats2 = generateDummyStats(new Date('Jan 02 2001 UTC'))
		await CoronaDbService.saveStats(stats2)

		const new_stats = await CoronaDbService.getLatestStats()

		expect(new_stats.createdDate.getUTCDate()).toBe(2)
	})
})

function generateDummyStats(date1) {
	const stats1 = {
		createdDate: date1,
		stats: [
			{
				country: 'Nepal',
				total_cases: 111,
			},
		],
	}

	return stats1
}
