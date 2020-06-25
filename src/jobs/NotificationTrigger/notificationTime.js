const moment = require('moment')
const momentTz = require('moment-timezone')
const { NOTIFICATION_TIMES } = require('./config')
const verifyNoticiableTime = (currentTime) => {
	const currentNumericTime = new Date(moment(currentTime,"HH:mm:ss"));
	let rightTimetoNotify = false;
	let notificationTimes = NOTIFICATION_TIMES.split(",")
	notificationTimes.map(time=>{
		let timetoSend = new Date(moment(time, "HH:mm:ss"));
		let diff = currentNumericTime.getTime()-timetoSend.getTime();
		if(Math.abs(diff)<=300000 && diff<=0){
			rightTimetoNotify = true
		}
	})
	return rightTimetoNotify;
}

const getStartEndTime = () => {
	const startTime = moment().startOf('day')
	const endTime = moment().endOf('day')
	return {
		startTime,
		endTime
	}
}

const getStartEndTimeForUser = (tz) => {
	const startTime = momentTz()
		.tz(tz)
		.startOf('day')
	const endTime = momentTz()
		.tz(tz)
		.endOf('day')

	return {
		startTime,
		endTime
	}
}

module.exports = {
	getStartEndTime,
	verifyNoticiableTime,
	getStartEndTimeForUser
}
