require('dotenv').config()

module.exports = {
	apps: [
		{
			name: 'nepaltoday.api',
			script: 'index.js',
			instances: process.env.APP_INSTANCES || 'max',
			autorestart: true,
			watch: process.env.NODE_ENV == 'development' ? true : false,
			max_memory_restart: process.env.APP_MEMORY_LIMIT || '2G',
		},
	],
}
