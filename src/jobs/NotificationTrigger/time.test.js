const { verifyNoticiableTime } = require('./notificationTime')

describe('time test', () => {
	it('test the noticiable time', () => {
		expect(verifyNoticiableTime('9:00')).toBe(true)
		expect(verifyNoticiableTime('8:58')).toBe(true)
		expect(verifyNoticiableTime('9:02')).toBe(false)
	})
})
