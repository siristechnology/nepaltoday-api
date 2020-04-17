require('newrelic')
require('./config/env')
const morgan = require('morgan')
const express = require('express')
const timeout = require('connect-timeout')
const helmet = require('helmet')
const requireGraphQLFile = require('require-graphql-file')
const { ApolloServer, gql } = require('apollo-server-express')
require('./db-service/initialize')
const mongooseSchema = require('./db-service/database/mongooseSchema')
const resolvers = require('./database/resolvers')
const colors = require('colors/safe')

const isDevelopment = process.env.NODE_ENV === 'development'

const app = express()
app.use(timeout('30s'))
app.use((req, res, next) => {
	if (!req.timedout) {
		next()
	}
})
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('combined'))

const typeDefSchema = requireGraphQLFile('./database/typeDefs.graphql')
const typeDefs = gql(typeDefSchema)

const apolloServer = new ApolloServer({
	typeDefs: typeDefs,
	resolvers: resolvers,
	context: ({ req, res }) => ({
		...{ userContext: req.payload, ip: req.ip },
		...mongooseSchema,
	}),
})
apolloServer.applyMiddleware({ app })

app.use((err, req, res, next) => {
	res.status(err.status || 500)

	res.send({
		error: {
			message: err.message,
			stacktrace: isDevelopment ? err.stack : {},
		},
	})
})

app.listen(process.env.PORT, () => console.log(colors.rainbow(`Server running on http://localhost:${process.env.PORT}`)))
