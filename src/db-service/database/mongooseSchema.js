const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Article = mongoose.model(
	'Article',
	new Schema({
		id: String,
		title: { type: String, required: true, unique: true },
		link: { type: String, unique: true, required: true },
		imageLink: { type: String, required: true },
		isHeadline: Boolean,
		shortDescription: String,
		category: String,
		content: String,
		source: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', required: true },
		hostIp: String,
		publishedDate: { type: Date },
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now }
	})
)

const Source = mongoose.model(
	'Source',
	new Schema({
		id: String,
		name: String,
		link: String,
		logoLink: String,
		category: [
			{
				name: String,
				path: String
			}
		],
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now }
	})
)

const TwitterHandle = mongoose.model(
	'TwitterHandle',
	new Schema({
		id: String,
		name: String,
		handle: String,
		category: String,
		userWeight: Number,
		categoryWeight: Number
	})
)

const Tweet = mongoose.model(
	'Tweet',
	new Schema({
		twitterHandle: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'TwitterHandle'
		},
		tweetId: { type: String, unique: true },
		handle: { type: String },
		text: String,
		createdAt: { type: Date, default: Date.now },
		publishedDate: { type: Date },
		name: String,
		profileImage: String,
		description: String
	})
)
const User = mongoose.model(
	'User',
	new Schema({
		fcmToken: { type: String, unique: true },
		countryCode: String,
		timeZone: String
	})
)
const Notification = mongoose.model(
	'Notification',
	new Schema({
		article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		createdAt: { type: Date, default: Date.now() },
		updatedAt: { type: Date, default: Date.now() }
	}).index({ article: 1, user: 1 }, { unique: true })
)

module.exports = {
	User,
	Tweet,
	Article,
	Source,
	Notification,
	TwitterHandle
}
