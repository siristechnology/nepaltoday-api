/* eslint-disable no-return-await */
// const mongoose = require('mongoose')

const dbHandler = require('./dbHandler')
const notificationDbService = require('../NotificationDbService')

const { users } = require('./users.json')
const { articles } = require('./articles.json')

beforeAll(async () => await dbHandler.connect())

afterEach(async () => await dbHandler.clearDatabase())

afterAll(async () => await dbHandler.closeDatabase())

const payload = [
	{
		article: articles[0]._id,
		user: users[0]._id
	},
	{
		article: articles[1]._id,
		user: users[1]._id
	}
]

describe('Notification Db service ', () => {
	it('should save single notification', async () => {
		expect(async () => await notificationDbService.saveNotification(payload[0])).not.toThrow()
	})
	it('should save multiple notifications and get notifications back', async () => {
		await notificationDbService.saveNotifications(payload)
		const notifications = await notificationDbService.getNotifications()
		expect(notifications).not.toBeUndefined()
	})
})
