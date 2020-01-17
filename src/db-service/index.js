require('dotenv').config()
const userDbService = require('./src/UserDbService.js')
const newsDbService = require('./src/newsDbService.js')
const TweetDbService = require('./src/TweetDbService.js')
const mongooseSchema = require('./src/database/mongooseSchema')
const NotificationDbService = require('./src/NotificationDbService')

const mongoose = require('mongoose')
mongoose.promise = global.Promise
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })

module.exports = {
	newsDbService,
	TweetDbService,
	mongooseSchema,
	userDbService,
	NotificationDbService,
}
