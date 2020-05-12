/* eslint-disable no-undef */
const sourceList = [
	{
		name: 'सेतोपाटी',
		link: 'https://setopati.com',
		logoLink: "/assets/logos/setopati.jpg",
		category: [
			{
				name: 'politics',
				path: '/politics'
			},
			{
				name: 'social',
				path: '/social'
			},
			{
				name: 'opinion',
				path: '/opinion'
			},
			{
				name: 'sports',
				path: '/sports'
			},
			{
				name: 'entertainment',
				path: '/art'
			}
		]
	},
	{
		name: 'दैनिक नेपाल',
		link: 'https://dainiknepal.com',
		logoLink: "/assets/logos/dainik.jpg",
		category: [
			{
				name: 'news',
				path: '/section/latest-news'
			},
			{
				name: 'opinion',
				path: '/section/views'
			},
			{
				name: 'sports',
				path: '/section/sports'
			},
			{
				name: 'entertainment',
				path: '/section/kala'
			},

			{
				name: 'business',
				path: '/section/market'
			}
		]
	},
	{
		name: 'कान्तिपुर',
		link: 'https://ekantipur.com',
		logoLink: "/assets/logos/kantipur.jpg",
		category: [
			{
				name: 'news',
				path: '/news'
			},
			{
				name: 'business',
				path: '/business'
			},
			{
				name: 'opinion',
				path: '/opinion'
			},
			{
				name: 'sports',
				path: '/sports'
			},
			{
				name: 'entertainment',
				path: '/entertainment'
			}
		]
	},
	{
		name: 'रातोपाटी',
		link: 'https://ratopati.com',
		logoLink: "/assets/logos/ratopati.jpg",
		category: [
			{
				name: 'news',
				path: '/category/news'
			},
			{
				name: 'business',
				path: '/economy'
			},
			{
				name: 'opinion',
				path: '/category/opinion'
			},
			{
				name: 'sports',
				path: '/category/sports'
			},
			{
				name: 'entertainment',
				path: '/entertainment'
			}
		]
	},
	{
		name: 'अनलाईन खबर',
		link: 'https://onlinekhabar.com',
		logoLink: "/assets/logos/online-khabar.png",
		category: [
			{
				name: 'business',
				path: '/business'
			},
			{
				name: 'sports',
				path: '/sports'
			},
			{
				name: 'entertainment',
				path: '/entertainment'
			}
		]
	},
	{
		name: 'BBC नेपाली',
		link: 'https://bbc.com/nepali',
		logoLink: "/assets/logos/bbc.png",
		category: [
			{
				name: 'news',
				path: ''
			}
		]
	}
]

sourceList.forEach(function(source) {
	print('____________Updating existing source and inserting new source if not exist_________')
	printjson(source)
	db.sources.update({ link: source.link }, source, { upsert: true })
})
