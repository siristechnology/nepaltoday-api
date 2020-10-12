const mongoose = require('mongoose')
require('../../../config/env')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const districtCoronaJob = require('../index')

jest.setTimeout(120000)

describe('districtCoronaJob integration', () => {
	it('should fetch stats abt Nepal', async () => {
		await districtCoronaJob()
	})
})
