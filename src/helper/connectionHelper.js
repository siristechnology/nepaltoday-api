require('../config/env')
const mongoose = require('mongoose')

const dbConnection = () => {
	return mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
}

module.exports = {
	dbConnection,
}
