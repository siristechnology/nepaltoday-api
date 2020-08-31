const selector = {
	kantipur: {
		title: 'main > article > header > h1',
		excerpt: 'main > article .description> p:nth-child(1)',
		'lead-image': '#wrapper main article header figure img',
		content: ['main article div.text-wrap p.description', 'main article div.text-wrap div.description'],
		tags: '',
		'likes-count': 'main > article > header div.total.shareTotal',
		LINK_SELECTOR: '#wrapper > main > section article > div.teaser > a',
	},
	ratopati: {
		title: '.article-head > h1',
		excerpt: '.ratopati-table-border-layout p:first-child',
		'lead-image': 'div .ot-material-card-content > div .img-with-no-margin > img',
		content: ['.ratopati-table-border-layout'],
		tags: '#content > div > div.ot-content-with-sidebar-right > div.col-md-9 > nav > ol > li.breadcrumb-item.active > a',
		LINK_SELECTOR: 'div.ot-articles-material-blog-list .item-content > span > a',
	},
	setopati: {
		title: 'section.news-detail-section div.title-names span.news-big-title',
		excerpt: '#content > div.container > div > aside.left-side > div.row > div > div.editor-box > p:nth-child(2)',
		'lead-image': 'section.news-detail-section div.featured-images figure img',
		content: ['aside.left-side div.detail-box div.editor-box'],
		tags: '#header > div.container.main-menu > div > div > div > ul > li > a.selected',
		LINK_SELECTOR: '#content > div > section > div > div > a',
	},
	dainik: {
		title: 'div#sing_left div#sing_cont h1.inside_head',
		excerpt: 'div#sing_left div#sing_cont div.content p:nth-child(2)',
		'lead-image': 'div#sing_left div#sing_cont div.content img',
		content: ['div#sing_left div#sing_cont div.content'],
		tags: 'div#the_body #menu_div > ul > a > li.mactive',
		LINK_SELECTOR: '#archlist > div > h2 > a',
	},
	onlinekhabar: {
		title: 'h2.mb-0',
		excerpt: 'div.main__read--content p:first-child',
		'lead-image': 'div.col.colspan3.dtl-img img',
		content: ['div.main__read--content'],
		tags: '#main > section > div > div.nws__title--card > div.custom_breadcrumb > a:nth-child(2)',
		LINK_SELECTOR: '#main > section > div .post__heading > h2 > a',
	},
	bbcnepali: {
		title: '#content',
		excerpt: 'main > div > p',
		'lead-image': 'main > div > figure > div > div.NestedGridItemChildLarge-sc-12lwanc-9.fkKpIa > div > img',
		content: ['main > div > p'],
		LINK_SELECTOR: 'h3 > a',
	},
	swasthyakhabar: {
		title: 'article.module.module-detail > h1',
		excerpt: 'article.module.module-detail > section > p:nth-child(7)',
		'lead-image': 'article.module.module-detail > section > div.img-wrap > figure > fig > img',
		content: ['article.module.module-detail > section > p'],
		LINK_SELECTOR: 'article > header > h2 > a',
	},
}

module.exports = {
	selector,
}
