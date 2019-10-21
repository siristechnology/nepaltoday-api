const { graphql } = require('graphql')
const { importSchema } = require('graphql-import')
const { makeExecutableSchema } = require('graphql-tools')

const { resolver } = require('./resolvers')
const typeDefs = importSchema('./typeDefs.graphql')

const schema = makeExecutableSchema({ typeDefs, resolver })

const graphqlTestCall = async (query, variables) => {
	return graphql(
		schema,
		query,
		undefined,
		{
			req: {},
			res: {
				clearCookie: () => {},
			},
		},
		variables,
	)
}

module.exports = {
	graphqlTestCall,
}
