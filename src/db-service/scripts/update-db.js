const { TwitterHandle, Source, PoliticianHandle, PoliticianTweetCount } = require('../database/mongooseSchema')
const TwitterHandles = require('./twitter-handles')
const NewsSources = require('./source-data')
const PoliticianTwitterHandles = require('./politician-handles')
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

const PoliticianHandlesUpdate = async() => {
	const resultPromises = PoliticianTwitterHandles.map(async (handle) => {
		return PoliticianHandle.updateOne({ handle: handle.handle}, handle, {upsert: true})
	})

	return Promise.all(resultPromises)
}

const PoliticianCountUpdate = async() => {
	const resultPromises = PoliticianTwitterHandles.map(async (handle) => {
		return PoliticianTweetCount.updateOne({ handle: handle.handle}, handle, {upsert: true})
	})

	return Promise.all(resultPromises)
}

async function waitForUpdates() {
	return Promise.all([TwitterHandlesUpdate(), NewsSourcesUpdate(), PoliticianHandlesUpdate(), PoliticianCountUpdate()])
}

waitForUpdates().then(() => {
	console.log('db updates done')
})
