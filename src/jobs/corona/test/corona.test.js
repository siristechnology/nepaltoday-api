const nock = require('nock')
const coronaJob = require('../index')
const statsResponseMock = require('./corona-stats-response.json')
const TestDbServer = require('../../../db-service/tests/test-db-server')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

describe('corona job', () => {
	it('should fetch stats', async () => {
		nock.disableNetConnect()
		nock('https://pomber.github.io').get('/covid19/timeseries.json').reply(200, statsResponseMock)
		nock('https://data.nepalcorona.info').get('/api/v1/world').reply(200, worldSummaryResponseMock)

		const stats = await coronaJob()
		expect(stats.worldSummary.totalCases).toBe(worldSummaryResponseMock.cases)
	})
})

const worldSummaryResponseMock = {
	updated: 1599944138669,
	cases: 28871193,
	todayCases: 223222,
	deaths: 922918,
	todayDeaths: 3821,
	active: 7219572,
}
