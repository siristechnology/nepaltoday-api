require('dotenv').config()
const mongoose = require('mongoose')
mongoose.promise = global.Promise

const { getUsers } = require('./UserDbService')

describe('User Db service ', () => {
	beforeAll(() => {
		mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
	})
	it('get all user from db', async () => {
		const users = await getUsers()
		expect(users.length).toBeGreaterThan(0)
	})
})
