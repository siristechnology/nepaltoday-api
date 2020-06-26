module.exports = async function (context) {
	const timeStamp = new Date().toISOString()

	const { verifyNoticiableTime } = require('./notificationTime')
	const { newsDbService, NotificationDbService } = require('../../db-service')
	const { getUsersWithCurrentTime } = require('./usersWithCurrentTime')
	const { sendPushNotification } = require('./pushNotificationSender')
	const { notificationExists, createUserWithNotification } = require('./notificationHelper')

	try {
		let userWithCurrentTime = await getUsersWithCurrentTime()
		if (userWithCurrentTime) {
			const latestArticle = await newsDbService.getLatestNewsArticle()
			if (latestArticle) {
				const notifications = []
				let continueToSend = true
				for (const user of userWithCurrentTime) {
					if (await notificationExists(user, latestArticle[0])) continueToSend = false
					else continueToSend = true

					if (continueToSend) {
						const eligibleTime = verifyNoticiableTime(user.currentTime)
						if (eligibleTime) {
							const userWithNotification = createUserWithNotification(latestArticle[0], user)
							let notificationSentStatus = await sendPushNotification(userWithNotification)
							if (notificationSentStatus.status) {
								const payload = {
									article: latestArticle[0]._id,
									user: user._id,
								}
								notifications.push(payload)
							}
						}
					} else {
						console.log('user has already got the notification')
					}
				}
				if (notifications.length > 0) {
					const notificationResponse = await NotificationDbService.saveNotifications(notifications)
					if (notificationResponse) {
						context.log('_____________notifications are saved successfully__________')
					}
				}
			}
		}
	} catch (error) {
		context.log('_____________error__________', error)
	}

	context.log('JavaScript timer trigger function ran!', timeStamp)
}
