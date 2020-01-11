'use strict'

const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const mongod = new MongoMemoryServer()

module.exports = {
	connect: async () => {
		const uri = await mongod.getConnectionString()

		const mongooseOpts = {
			useNewUrlParser: true,
			autoReconnect: true,
			reconnectTries: Number.MAX_VALUE,
			reconnectInterval: 1000
		}

		await mongoose.connect(uri, mongooseOpts)
	},

	/**
	 * Drop database, close the connection and stop mongod.
	 */
	closeDatabase: async () => {
		await mongoose.connection.dropDatabase()
		await mongoose.connection.close()
		await mongod.stop()
	},

	/**
	 * Remove all the data for all db collections.
	 */
	clearDatabase: async () => {
		const collections = mongoose.connection.collections

		for (const key in collections) {
			const collection = collections[key]
			await collection.deleteMany()
		}
	}
}
