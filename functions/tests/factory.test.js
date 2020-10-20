const {
  GoogleFactory,
  CALENDAR_API,
  GMAIL_API,
  DRIVE_API
} = require('../models')

describe('Google Factory ', () => {
  test('It should create a Calendar instance', () => {
    const calendarAPI = new GoogleFactory(CALENDAR_API)
    expect(calendarAPI.type === CALENDAR_API).toEqual(true)
  })
  test('It should create a Drive instance', () => {
    const driveAPI = new GoogleFactory(DRIVE_API)
    expect(driveAPI.type === DRIVE_API).toEqual(true)
  })
  test('It should create a Gmail instance', () => {
    const gmailAPI = new GoogleFactory(GMAIL_API)
    expect(gmailAPI.type === GMAIL_API).toEqual(true)
  })
})
