const { graphqlTestCall } = require('./graphqlTestCall')

const getArticlesQuery = `
  query GetArticlesQuery {
	{
		getArticles(criteria: { lastQueryDate: "" }) {
		  title
		  category
		  link
		  content
		  category
		  source {
			name
			logoLink
		  }
		}
	  }
`

let con

// beforeAll(async () => {
// 	con = await createConnection()
// })

// afterAll(async ()=> {
// 	await con.close();
// })

// describe('Graphql Resolvers', () => {
// 	it('get articles', async () => {
// 		const articles = await graphqlTestCall(getArticlesQuery, {})
// 		expect(articles).toBeDefined()
// 	})
// })
