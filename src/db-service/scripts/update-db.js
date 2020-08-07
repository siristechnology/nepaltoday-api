const { TwitterHandle, Source, TrendingHandle, TrendingTweetCount } = require('../database/mongooseSchema')
const TwitterHandles = require('./twitter-handles')
const NewsSources = require('./source-data')
const TrendingTwitterHandles = require('./trending-handles')
require('../initialize')

const TwitterHandlesUpdate = async () => {
	const resultPromises = TwitterHandles.map(async (handle) => {
		return TwitterHandle.updateOne({ handle: handle.handle }, handle, { upsert: true })
	})

	return Promise.all(resultPromises)
}

const NewsSourcesUpdate = async () => {
	const resultPromises = NewsSources.map(async (source) => {
		return Source.updateOne({ name: source.name }, source, { upsert: true })
	})

	return Promise.all(resultPromises)
}

const TrendingHandlesUpdate = async() => {
	const resultPromises = TrendingTwitterHandles.map(async (handle) => {
		return TrendingHandle.updateOne({ handle: handle.handle}, handle, {upsert: true})
	})

	return Promise.all(resultPromises)
}

async function waitForUpdates() {
	return Promise.all([TwitterHandlesUpdate(), NewsSourcesUpdate(), TrendingHandlesUpdate()])
}

waitForUpdates().then(() => {
	console.log('db updates done')
})
