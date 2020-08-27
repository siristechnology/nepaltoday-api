const { TwitterHandle, Source, TrendingHandle, FacebookLongLiveToken } = require('../database/mongooseSchema')
const TwitterHandles = require('./twitter-handles')
const { TrendingTwitterHandles } = require('./trending-handles')
const axios = require('axios')
require('../initialize')
require('dotenv').config()

const TwitterHandlesUpdate = async () => {
	const resultPromises = TwitterHandles.map(async (handle) => {
		return TwitterHandle.updateOne({ handle: handle.handle }, handle, { upsert: true })
	})

	return Promise.all(resultPromises)
}

const TrendingHandlesUpdate = async() => {
	const resultPromises = TrendingTwitterHandles.map(async (handle) => {
		return TrendingHandle.updateOne({ handle: handle.handle}, handle, {upsert: true})
	})

	return Promise.all(resultPromises)
}

const FacebookTokenUpdate = async() => {
	let myToken = await axios.get(encodeURI(`https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_CLIENT_ID}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&fb_exchange_token=${process.env.FACEBOOK_ACCESS_TOKEN}`))
	let toSaveData = new FacebookLongLiveToken({
		longLiveToken: myToken.data.access_token
	})
	let saved = await toSaveData.save()
	return saved
}

async function waitForUpdates() {
	return Promise.all([TwitterHandlesUpdate(), TrendingHandlesUpdate(), FacebookTokenUpdate()])
}

waitForUpdates().then(() => {
	console.log('db updates done')
})
