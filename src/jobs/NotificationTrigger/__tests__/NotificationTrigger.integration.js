const NotificationTrigger = require('../index')
require('../../../db-service/initialize')

jest.setTimeout(200000)

describe('NotificationTrigger integration', () => {
	it('Integration test', async () => {
		await NotificationTrigger(console, {})
	})
})
