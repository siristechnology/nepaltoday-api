require('dotenv').config()

const NOTIFICATION_TIMES = process.env.NOTIFICATION_TIMES;
const FIREBASE_NOTIFICATION_URL = 'https://fcm.googleapis.com/fcm/send'

const FIREBASE_SERVER_KEY = process.env.FIREBASE_SERVER_KEY

module.exports = { FIREBASE_SERVER_KEY,NOTIFICATION_TIMES, FIREBASE_NOTIFICATION_URL }