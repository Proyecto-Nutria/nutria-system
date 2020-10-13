const { SingletonAdmin } = require('./SingletonAdmin')
const {
  GoogleFactory,
  CALENDAR_API,
  DRIVE_API,
  PDF_TYPE,
  FOLDER_TYPE,
  DOC_TYPE
} = require('./GoogleFactory')

module.exports = {
  SingletonAdmin,
  GoogleFactory,
  CALENDAR_API,
  DRIVE_API,
  PDF_TYPE,
  FOLDER_TYPE,
  DOC_TYPE
}
