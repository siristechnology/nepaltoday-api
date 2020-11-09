const { User } = require('./database/mongooseSchema')

module.exports = {
	getUsers: async () => {
		const users = await User.find().lean()
		return users
	},

	removeUnRegisteredUser: async (fcmToken) => {
		const response = await User.findOneAndUpdate({fcmToken},{status: 'inactive'},{useFindAndModify: false})
		return response
	}

}
