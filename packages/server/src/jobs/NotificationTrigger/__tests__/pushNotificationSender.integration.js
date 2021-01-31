const { sendPushNotification } = require('../pushNotificationSender')
const { newsDbService } = require('../../../db-service/')
require('dotenv').config()

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

describe('PushNotificationSender integration', () => {
	it('single notification should go successfullly', async () => {
		const latestArticle = await newsDbService.getLatestNewsArticle()

		const oneNotification = {
			notification: {
				title: latestArticle[0].title,
				body: latestArticle[0].shortDescription.substring(0, 100) + '...',
			},
			to: process.env.TEST_USER_FCM_TOKEN,
			data: {
				_id: latestArticle[0]._id,
			},
		}
		const notificationSentStatus = await sendPushNotification(oneNotification)

		expect(notificationSentStatus.status).toBeTruthy()
		expect(notificationSentStatus.success).toBe(1)
		expect(notificationSentStatus.failure).toBe(0)
	})
})
