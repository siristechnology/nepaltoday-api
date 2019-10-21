const casual = require('casual')
module.exports = {
	Source: () => ({
		_id: casual.uuid,
		name: casual.name,
		url: 'news_url',
		category: 'news_category',
		link: 'news_link',
		logoLink: 'logo_link',
	}),
	Article: () => ({
		_id: casual.uuid,
		title: casual.name,
		shortDescription: casual.short_description,
		content: casual.description,
		link: 'abc.com',
		imageLink: 'abc.com/downloads/a.jpeg',
		category: 'politics',
		publishedDate: casual.date,
		createdDate: casual.date,
		modifiedDate: casual.date,
	}),
}
