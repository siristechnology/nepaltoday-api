const { Notification } = require('./database/mongooseSchema')
const logger = require('../config/logger')

module.exports = {
	saveNotification: async (notification) => {
		const res = await Notification.create(notification)
		return res
	},

	saveNotifications: async (notifications) => {
		try {
			const res = await Notification.insertMany(notifications)
			return res
		} catch (error) {
			if (error.code === 11000 || error.code === 11001) {
				logger.debug('ignored duplicates')
			} else {
				logger.error('Error on saveNotifications:', error)
			}
			throw new Error(error)
		}
	},

	getNotifications: async (conditions = {}) => {
		const notificationHistory = await Notification.find(conditions)
		return notificationHistory
	},
	deleteNotification: async (conditions) => {
		const deletedNotifications = await Notification.deleteMany(conditions)
		return deletedNotifications
	},
}
