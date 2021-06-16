const { verifyNoticiableTime, verifyCoronaNotificationTime } = require('./notificationTime')
const { newsDbService, NotificationDbService, DistrictCoronaDbService } = require('../../db-service')
const { getUsersWithCurrentTime } = require('./usersWithCurrentTime')
const { sendPushNotification } = require('./pushNotificationSender')
const { notificationExists, createUserWithNotification, createUserWithCoronaNotification } = require('./notificationHelper')
const logger = require('../../config/logger')

module.exports = async function () {
	try {
		const userWithCurrentTime = await getUsersWithCurrentTime()

		if (userWithCurrentTime) {
			const latestArticle = await newsDbService.getLatestNewsArticle()

			if (latestArticle) {
				const notifications = []
				for (const user of userWithCurrentTime) {
					if (!user.status || (user.status && user.status != 'inactive')) {
						const shouldSendNotification = !(await notificationExists(user, latestArticle[0]))
						if (shouldSendNotification) {
							const eligibleTime = verifyNoticiableTime(user.currentTime)
							if (eligibleTime) {
								const userWithNotification = createUserWithNotification(latestArticle[0], user)
								const notificationSentStatus = await sendPushNotification(userWithNotification)
								if (notificationSentStatus.status) {
									const payload = {
										article: latestArticle[0]._id,
										user: user._id,
									}
									notifications.push(payload)
								}
							}
						} else {
							logger.info('User has already got the notification.')
						}
					}
				}
				if (notifications.length > 0) {
					const notificationResponse = await NotificationDbService.saveNotifications(notifications)
					if (notificationResponse) {
						logger.debug('Notifications saved successfully.')
					}
				}
			}

			let aDayAgo = new Date()
			aDayAgo.setDate(aDayAgo.getDate() - 1)

			const latestSummary = await DistrictCoronaDbService.getDistrictCoronaStats()
			if (latestSummary && latestSummary.createdDate > aDayAgo) {
				for (const user of userWithCurrentTime) {
					const coronaNotificationEligibleTime = verifyCoronaNotificationTime(user.currentTime)

					if (coronaNotificationEligibleTime) {
						const userWithNotification = createUserWithCoronaNotification(latestSummary.timeLine, user)
						sendPushNotification(userWithNotification)
					}
				}
			}
		}
	} catch (error) {
		logger.error('Error while sending notifications:', error)
	}

	logger.info('Notification Job completed successfully!', { date: new Date().toISOString() })
}
