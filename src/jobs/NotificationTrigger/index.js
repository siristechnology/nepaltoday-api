const { verifyNoticiableTime, verifyCoronaNotificationTime } = require('./notificationTime')
const { newsDbService, NotificationDbService, DistrictCoronaDbService } = require('../../db-service')
const { getUsersWithCurrentTime } = require('./usersWithCurrentTime')
const { sendPushNotification } = require('./pushNotificationSender')
const { notificationExists, createUserWithNotification, createUserWithCoronaNotification } = require('./notificationHelper')

module.exports = async function (context) {
	const timeStamp = new Date().toISOString()

	try {
		const userWithCurrentTime = await getUsersWithCurrentTime()

		if (userWithCurrentTime) {
			const latestArticle = await newsDbService.getLatestNewsArticle()

			if (latestArticle) {
				const notifications = []
				for (const user of userWithCurrentTime) {
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

			const latestSummary = await DistrictCoronaDbService.getDistrictCoronaStats()
			if(latestSummary){
				for (const user of userWithCurrentTime) {
					const coronaNotificationEligibleTime = verifyCoronaNotificationTime(user.currentTime)

					if(coronaNotificationEligibleTime){
						const userWithNotification = createUserWithCoronaNotification(latestSummary.timeLine, user)
						sendPushNotification(userWithNotification)
					}

				}
			}

		}
	} catch (error) {
		context.log('_____________error__________', error)
	}

	context.log('JavaScript timer trigger function ran!', timeStamp)
}
