const TestDbServer = require('./test-db-server')
const notificationDbService = require('../NotificationDbService')

const { users } = require('./users.json')
const { articles } = require('./articles.json')

beforeAll(async () => await TestDbServer.connect())

afterEach(async () => await TestDbServer.clearDatabase())

afterAll(async () => await TestDbServer.closeDatabase())

const payload = [
	{
		article: articles[0]._id,
		user: users[0]._id,
	},
	{
		article: articles[1]._id,
		user: users[1]._id,
	},
]

describe('Notification Db service ', () => {
	it('should save single notification', async () => {
		expect(async () => await notificationDbService.saveNotification(payload[0])).not.toThrow()
	})

	it('should save multiple notifications and get notifications back', async () => {
		await notificationDbService.saveNotifications(payload)
		const notifications = await notificationDbService.getNotifications({ user: '5db1d31a7012d70fc6367058' })
		expect(notifications.length).toBe(1)
	})
})
