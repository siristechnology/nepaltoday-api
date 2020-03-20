require('dotenv').config()
const userDbService = require('./UserDbService.js')
const newsDbService = require('./newsDbService.js')
const TweetDbService = require('./TweetDbService.js')
const mongooseSchema = require('./database/mongooseSchema')
const NotificationDbService = require('./NotificationDbService')

const mongoose = require('mongoose')
mongoose.promise = global.Promise
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

module.exports = {
	newsDbService,
	TweetDbService,
	mongooseSchema,
	userDbService,
	NotificationDbService,
}
