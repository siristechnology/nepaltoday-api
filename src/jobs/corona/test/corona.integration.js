const mongoose = require('mongoose')
require('../../../config/env')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const coronaJob = require('../index')

describe('corona job integration', () => {
	it('should fetch stats abt Nepal', async () => {
		await coronaJob()
	})
})
