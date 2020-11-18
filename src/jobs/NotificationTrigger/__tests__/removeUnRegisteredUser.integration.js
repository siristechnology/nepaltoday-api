const { sendPushNotification } = require('../pushNotificationSender')
require('dotenv').config()
const mongoose = require('mongoose')
const { User } = require('../../../db-service/database/mongooseSchema')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

describe('Remove unregistered user', () => {
    it('should remove unregistered user', async () => {
        let randomUser = {nid: 'abcde', fcmToken: 'abcde'}
        let userObj = new User(randomUser)
        await userObj.save()
        let notificationObj = {
            notification: {
                title: 'कोरोना तथ्याङ्क',
            },
            to: randomUser.fcmToken,
            data: {
                notifType: 'corona',
            }
        }
        await sendPushNotification(notificationObj)
        const checkUserObj = await User.findOne({nid: randomUser.nid})
        await User.deleteOne({nid: randomUser.nid})
        expect(checkUserObj.status).toBe('inactive')
    })
})