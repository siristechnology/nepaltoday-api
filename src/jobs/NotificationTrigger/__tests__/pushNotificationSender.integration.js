const { sendPushNotification } = require('../pushNotificationSender')
const {  createUserWithNotification } = require('../notificationHelper')

describe('PushNotification integration', () => {
	it('sendPushNotification should send notification', async () => {
        const user = {
            fcmToken: 'dyCnmWTFSFyyLNbkUHWeIe:APA91bHk8yOTano5ye_1ZBEncUot1jNvR-aYbLBI-unagneAZnTTID0VUDgqc57MF9YBvV96VmXr_BkuAbkJlq-73S9KzqfPUrXtGIonkoe9qDahfZ-vA-UXwsrorwmKtEPTZ68mq9Fs'
        }
        const article = {
            title: 'गरिखाने वर्ग भोकै मर्दैन, सरकार साथमा छः प्रवक्ता खतिवडा',
            shortDescription: 'काठमाडौं । सरकारले कोरोना भाइरस (कोभिड–१९) को सङ्क्रमणकोे त्रास र त्यसले निम्त्याएको दुष्प्रभावलाई कम गर्न सबै प्रकारको उपायको अवलम्बन गरेको स्पष्ट पारेको छ । अर्थ, एवं सञ्चार तथा सूचना प्रविधिमन्त्री डा.युवराज खतिवडाले कोरोनाका प्रभावका कारण दैनिक ज्यालादारीमा बाँच्ने तथा गरिखाने वर्गमाथि परेको प्र',
            content: 'काठमाडौं । सरकारले कोरोना भाइरस (कोभिड–१९) को सङ्क्रमणकोे त्रास र त्यसले निम्त्याएको दुष्प्रभावलाई कम गर्न सबै प्रकारको उपायको अवलम्बन गरेको स्पष्ट पारेको छ । अर्थ, एवं सञ्चार तथा सूचना प्रविधिमन्त्री डा.युवराज खतिवडाले कोरोनाका प्रभावका कारण दैनिक ज्यालादारीमा बाँच्ने तथा गरिखाने वर्गमाथि परेको प्र',
            imageLink: 'https://ratopati.prixacdn.net/media/albums/yubaraj_fWJau64tL1.PNG',
            source: {
                logoLink: 'https://i.imgur.com/h4EKX8S.png'
            }
        }
        const userWithNotification = createUserWithNotification(article,user)
        const resp = await sendPushNotification(userWithNotification)

        expect(resp.status).toBe(true)
        expect(resp.success).toBe(1)
        expect(resp.failure).toBe(0)
	})
})
