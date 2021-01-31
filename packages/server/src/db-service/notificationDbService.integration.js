require('dotenv').config()
const NotificationDbService = require('./NotificationDbService')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

jest.setTimeout(20000)

describe('NotificationDbService', () => {
	beforeAll(() => {
		mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
	})
	it('saveNotification should save an notification successfully', async () => {
		const notification = {
			article: new mongoose.Types.ObjectId(),
			user: new mongoose.Types.ObjectId(),
		}
		const savedNotification = await NotificationDbService.saveNotification(notification)

		expect(savedNotification).not.toBeNull()
		expect(savedNotification).not.toBeUndefined()
		expect(savedNotification._id).not.toBeNull()

		await NotificationDbService.deleteNotification({ _id: savedNotification._id })
	})

	it('saveNotifications should save more than one notifications successfully', async () => {
		const notifications = [
			{
				article: new mongoose.Types.ObjectId(),
				user: new mongoose.Types.ObjectId(),
			},
			{
				article: new mongoose.Types.ObjectId(),
				user: new mongoose.Types.ObjectId(),
			},
			{
				article: new mongoose.Types.ObjectId(),
				user: new mongoose.Types.ObjectId(),
			},
		]

		const savedNotifications = await NotificationDbService.saveNotifications(notifications)
		const notificationsLength = savedNotifications.length
		expect(savedNotifications).not.toBeUndefined()
		expect(savedNotifications).not.toBeNull()

		expect(notificationsLength).toBeGreaterThan(1)

		await NotificationDbService.deleteNotification({})
	})
	it('getNotifications should get more than one notifications successfully', async () => {
		const notifications = await NotificationDbService.getNotifications()

		expect(notifications).not.toBeUndefined()
		expect(notifications).not.toBeNull()
		expect(notifications.length).toBeGreaterThan(1)
	})
})
