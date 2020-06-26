require('dotenv').config()

const NOTIFICATION_TIMES = process.env.NOTIFICATION_TIMES || '6:00,9:00,12:00,15:00,18:00,21:00'
const FIREBASE_NOTIFICATION_URL = 'https://fcm.googleapis.com/fcm/send'

const FIREBASE_SERVER_KEY = process.env.FIREBASE_SERVER_KEY

module.exports = { FIREBASE_SERVER_KEY, NOTIFICATION_TIMES, FIREBASE_NOTIFICATION_URL }
