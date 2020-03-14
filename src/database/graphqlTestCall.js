const { graphql } = require('graphql')
const requireGraphQLFile = require('require-graphql-file')
const typeDefs = requireGraphQLFile('./typeDefs.graphql')

const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools')
const mocks = require('./mocks')

const schema = makeExecutableSchema({ typeDefs })

addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true })

const graphqlTestCall = async (query, variables) => {
	const response = await graphql(schema, query)
	return response
}

module.exports = {
	graphqlTestCall,
}
