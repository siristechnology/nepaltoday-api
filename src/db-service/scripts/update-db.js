const { TwitterHandle, TrendingHandle } = require('../database/mongooseSchema')
const TwitterHandles = require('./twitter-handles')
const { TrendingTwitterHandles } = require('./trending-handles')
require('../initialize')
require('dotenv').config()

const TwitterHandlesUpdate = async () => {
	const resultPromises = TwitterHandles.map(async (handle) => {
		return TwitterHandle.updateOne({ handle: handle.handle }, handle, { upsert: true })
	})

	return Promise.all(resultPromises)
}

const TrendingHandlesUpdate = async () => {
	const resultPromises = TrendingTwitterHandles.map(async (handle) => {
		return TrendingHandle.updateOne({ handle: handle.handle }, handle, { upsert: true })
	})

	return Promise.all(resultPromises)
}

async function waitForUpdates() {
	return Promise.all([TwitterHandlesUpdate(), TrendingHandlesUpdate()])
}

waitForUpdates().then(() => {
	console.log('db updates done')
})
