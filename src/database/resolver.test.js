const { graphqlTestCall } = require('./graphqlTestCall')
const { dbConnection } = require('../helper/connectionHelper')
const { graphql } = require('graphql')

const query = `
query tasksForUser {
  getArticles { _id, title }
}
`

let con

beforeAll(async () => {
	con = await dbConnection()
})

afterAll(async () => {
	await con.connection.close()
})

describe('Graphql Resolvers', () => {
	it('get articles', async () => {
		const articles = await graphqlTestCall(query)
		console.log('_______________articles here_______________', articles)
		expect(articles.data.length).toBeGreaterThan(0)
	})
})
