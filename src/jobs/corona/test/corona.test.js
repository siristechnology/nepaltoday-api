const nock = require('nock')
const coronaJob = require('../index')
const mockStatsResponse = require('./corona-stats-response.json')
const TestDbServer = require('../../../db-service/tests/test-db-server')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

describe('corona job', () => {
	it('should fetch stats abt Nepal', async () => {
		nock('https://pomber.github.io')
			.get('/covid19/timeseries.json')
			.reply(200, mockStatsResponse)

		await coronaJob(['Albania'])
	})
})
