const { sendPushNotification } = require('../pushNotificationSender')
const { DistrictCoronaDbService } = require('../../../db-service/')
require('dotenv').config()
const { createUserWithCoronaNotification } = require('../notificationHelper')

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

describe('Corona Notification integration', () => {
	it('single corona notification should go successfullly', async () => {
		const latestSummary = await DistrictCoronaDbService.getDistrictCoronaStats()
		const user = { fcmToken: process.env.TEST_USER_FCM_TOKEN }
		const notification = createUserWithCoronaNotification(latestSummary.timeLine, user)

		const notificationSentStatus = await sendPushNotification(notification)

		expect(notificationSentStatus.status).toBeTruthy()
		expect(notificationSentStatus.success).toBe(1)
		expect(notificationSentStatus.failure).toBe(0)
	})
})
