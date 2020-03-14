require('newrelic')
require('./src/config/env')
const morgan = require('morgan')
const express = require('express')
const requireGraphQLFile = require('require-graphql-file')
const mongoose = require('mongoose')
const errorhandler = require('errorhandler')
const { ApolloServer, gql } = require('apollo-server-express')
const mongooseSchema = require('./src/db-service/database/mongooseSchema')
const startJobs = require('./src/jobs/job-runner/start-jobs')
const resolvers = require('./src/database/resolvers')
const colors = require('colors/safe')

const isDevelopment = process.env.NODE_ENV === 'development'

startJobs()

mongoose.promise = global.Promise
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('combined'))

if (isDevelopment) {
	app.use(errorhandler())
}

// Error handlers & middlewares
if (isDevelopment) {
	app.use((err, req, res, next) => {
		res.status(err.status || 500)

		res.send({
			errors: {
				message: err.message,
				error: err,
			},
		})
	})
}

app.use((err, req, res, next) => {
	res.status(err.status || 500)

	res.send({
		errors: {
			message: err.message,
			error: {},
		},
	})
})

const typeDefSchema = requireGraphQLFile('./src/database/typeDefs.graphql')
const typeDefs = gql(typeDefSchema)

const server = new ApolloServer({
	typeDefs: typeDefs,
	resolvers: resolvers,
	context: ({ req, res }) => ({
		...{ userContext: req.payload },
		...mongooseSchema,
	}),
})

server.applyMiddleware({ app })

app.listen(process.env.PORT, () => console.log(colors.rainbow(`Server running on http://localhost:${process.env.PORT}`)))
