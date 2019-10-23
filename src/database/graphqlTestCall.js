const { graphql } = require('graphql')
const { importSchema } = require('graphql-import')
const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools')
const mocks = require('./mocks')

// const { resolver } = require('./resolvers')
const typeDefs = importSchema('src/database/typeDefs.graphql') /* Warning: Must be an absolute path */

const schema = makeExecutableSchema({ typeDefs })

addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true })

const graphqlTestCall = async (query, variables) => {
	const response = await graphql(schema, query)
	return response
}

module.exports = {
	graphqlTestCall,
}
