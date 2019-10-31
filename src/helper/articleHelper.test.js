const { getSortedArticle } = require('./articleHelper')
describe('Sort News with weight', () => {
	it('sort article by weight', () => {
		const initial = [
			{
				_id: 1,
				title: 'KantipurNews',
				content: 'Kantipur first news  content',
				category: 'news',
				publishedDate: 100,
				source: {
					_id: 11,
					link: 'https://ekantipur.com',
				},
			},
			{
				_id: 2,
				title: 'Kantipur social news',
				content: 'Kantipur first  social news  content',
				category: 'social',
				publishedDate: 150,

				source: {
					_id: 12,
					link: 'https://ekantipur.com',
				},
			},
			{
				_id: 3,
				title: 'seto pati news article',
				content: 'setopati first news  content',
				category: 'news',
				publishedDate: 50,

				source: {
					_id: 13,
					link: 'https://setopati.com',
				},
			},
		]

		const expected = [
			{
				_id: 2,
				title: 'Kantipur social news',
				content: 'Kantipur first  social news  content',
				category: 'social',
				publishedDate: 150, // 1

				source: {
					_id: 12,
					link: 'https://ekantipur.com',
				},
				weight: 0, // for checking purposes only
			},
			{
				_id: 1,
				title: 'KantipurNews',
				content: 'Kantipur first news  content',
				category: 'news',
				publishedDate: 100, //2
				source: {
					_id: 11,
					link: 'https://ekantipur.com',
				},
				weight: 0,
			},

			{
				_id: 3,
				title: 'seto pati news article',
				content: 'setopati first news  content',
				category: 'news',
				publishedDate: 50, //3
				source: {
					_id: 13,
					link: 'https://setopati.com',
				},
				weight: 0,
			},
		]

		const sortedArticles = getSortedArticle(initial).map(a => {
			a.weight = 0
			return a
		})
		expect(JSON.stringify(sortedArticles)).toBe(JSON.stringify(expected))
	})
})
