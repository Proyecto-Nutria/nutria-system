const { SingletonAdmin } = require('./SingletonAdmin')
const { FirebaseAdmin } = require('./FirebaseAdmin')

const {
  GoogleFactory,
  CALENDAR_API,
  DRIVE_API,
  PDF_TYPE,
  FOLDER_TYPE,
  DOC_TYPE
} = require('./GoogleFactory')

const {
  EmailFactory,
  CONFIRMATION_EMAIL,
  CANCELLATION_EMAIL
} = require('./EmailFactory')

module.exports = {
  SingletonAdmin,
  GoogleFactory,
  CALENDAR_API,
  DRIVE_API,
  PDF_TYPE,
  FOLDER_TYPE,
  DOC_TYPE,
  EmailFactory,
  CONFIRMATION_EMAIL,
  CANCELLATION_EMAIL,
  FirebaseAdmin
}
