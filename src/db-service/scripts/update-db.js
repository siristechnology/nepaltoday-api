const { TwitterHandle, Source } = require('../database/mongooseSchema')
const TwitterHandles = require('./twitter-handles')
const NewsSources = require('./source-data')
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

async function waitForUpdates() {
	return Promise.all([TwitterHandlesUpdate(), NewsSourcesUpdate()])
}

waitForUpdates().then(() => {
	console.log('db updates done')
})
