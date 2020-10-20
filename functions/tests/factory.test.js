const {
  GoogleFactory,
  CALENDAR_API,
  GMAIL_API,
  DRIVE_API,
  DOC_TYPE,
  FOLDER_TYPE,
  SingletonAdmin,
  FirebaseAdmin
} = require('../models')

const {
  FIREBASE_VAL,
  ROOM_REF,
  ROOM_DATE_ATTR,
  INTERVIEW_REF,
  INTERVIEW_INTERVIEWEE_UIDDATE
} = require('../resolvers/constants')

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
