const moment = require('moment')
require('dotenv').config()

const verifyFacebookPostTime = () => {
    let currenDate = new Date()
    let currentTime = currenDate.getHours() + ":" + currenDate.getMinutes()
    let currentNumericTime = new Date(moment(currentTime, 'HH:mm:ss'))
    let rightTimetoPost = false
    let facebookPostTimes = process.env.FACEBOOK_POST_TIME.split(',')
    facebookPostTimes.map((time)=>{
        let timetoSend = new Date(moment(time, 'HH:mm:ss'))
		const diff = currentNumericTime.getTime() - timetoSend.getTime()
		if (Math.abs(diff) <= 300000 && diff <= 0) {
			rightTimetoPost = true
		}
    })
    return rightTimetoPost
}

module.exports = {
    verifyFacebookPostTime
}