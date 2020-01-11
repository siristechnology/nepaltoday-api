const { Notification } = require('./database/mongooseSchema')

module.exports = {
	saveNotification: async notification => {
		const res = await Notification.create(notification)
		return res
	},
	saveNotifications: async notifications => {
		try {
			for (const notification of notifications) {
				const res = await Notification.create(notification)
				return res
			}
		} catch (error) {
			if (error.code === 11000 || error.code === 11001) {
				console.log('________ignored duplicates________')
			} else {
				console.log(error)
			}
			throw new Error(error)
		}
	},

	getNotifications: async (conditions = {}) => {
		const notificationHistory = await Notification.find(conditions)
		return notificationHistory
	},
	deleteNotification: async conditions => {
		const deletedNotifications = await Notification.deleteMany(conditions)
		return deletedNotifications
	}
}
