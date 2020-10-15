const { SingletonAdmin } = require('./SingletonAdmin')
const { FirebaseAdmin } = require('./FirebaseAdmin')

const {
  GoogleFactory,
  CALENDAR_API,
  GMAIL_API,
  DRIVE_API,
  PDF_TYPE,
  FOLDER_TYPE,
  DOC_TYPE
} = require('./GoogleFactory')

module.exports = {
  SingletonAdmin,
  GoogleFactory,
  CALENDAR_API,
  GMAIL_API,
  DRIVE_API,
  PDF_TYPE,
  FOLDER_TYPE,
  DOC_TYPE,
  FirebaseAdmin
}
