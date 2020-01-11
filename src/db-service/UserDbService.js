const { User } = require('./database/mongooseSchema')

module.exports = {
	getUsers: async () => {
		const users = await User.find().lean()
		return users
	}
}
