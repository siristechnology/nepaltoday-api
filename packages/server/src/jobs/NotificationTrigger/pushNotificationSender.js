const logger = require('../../config/logger')
const axios = require('axios')
const { FIREBASE_SERVER_KEY } = require('./config')
const UserDbService = require('../../db-service/UserDbService')

const sendPushNotification = async (notification) => {
	try {
		const response = await makeRequest(notification)
		if (response.status === 200 && response.data.success === 1) {
			return { status: true, success: response.data.success, failure: response.data.failure }
		} else {
			if(response.data.results.length && (response.data.results[0].error=="NotRegistered" || response.data.results[0].error=="InvalidRegistration")){
				UserDbService.removeUnRegisteredUser(notification.to)
			}
			logger.error('Notification send failed: ', { response: response.data.results })
			return { status: false }
		}
	} catch (error) {
		logger.error('Notification send exception: ', error)
		return { status: false, message: `Notification send failed: ${error.stack}` }
	}
}

const makeRequest = async (data = {}) => {
	data.direct_book_ok = true
	const FIREBASE_NOTIFICATION_URL = 'https://fcm.googleapis.com/fcm/send'

	return axios({
		method: 'post',
		url: FIREBASE_NOTIFICATION_URL,
		data: data,
		headers: { Authorization: `key=${FIREBASE_SERVER_KEY}`, 'Content-Type': 'application/json' },
	})
}

module.exports = {
	sendPushNotification,
}
