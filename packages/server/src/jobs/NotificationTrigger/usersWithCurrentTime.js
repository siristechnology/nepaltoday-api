const moment = require('moment-timezone')
const { userDbService } = require('../../db-service')

const getUsersWithCurrentTime = async () => {
	try {
		let usersWithCurrentTime = null
		const users = await userDbService.getUsers()
		if (users) {
			usersWithCurrentTime = users.reduce((filtered, user) => {
				if (user.timeZone != null && user.timeZone !== undefined) {
					const currentTime = moment().tz(user.timeZone).format('HH:m')

					filtered.push({
						...user,
						currentTime,
					})
				}
				return filtered
			}, [])
		}
		return usersWithCurrentTime
	} catch (error) {
		console.log('______error______', error)
	}
}

module.exports = {
	getUsersWithCurrentTime,
}
