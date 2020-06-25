const { verifyNoticiableTime } = require('./notificationTime')
describe('time test', () => {
	it('test the noticiable time', () => {
		expect(verifyNoticiableTime('6:00')).toBe(true)
		expect(verifyNoticiableTime('5:58')).toBe(true)
		expect(verifyNoticiableTime('6:02')).toBe(false)
	})
})
