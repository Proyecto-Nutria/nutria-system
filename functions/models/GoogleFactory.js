const CALENDAR_API = 'calendar'
const DRIVE_API = 'drive'
const PDF_TYPE = 'application/pdf'
const DOC_TYPE = 'application/vnd.google-apps.document'
const FOLDER_TYPE = 'application/vnd.google-apps.folder'

const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const googleCredentials = require('../config/google-credentials.json')

class Credentials {
  constructor () {
    this._oAuth2Client = new OAuth2(
      googleCredentials.web.client_id,
      googleCredentials.web.client_secret,
      googleCredentials.web.redirect_uris[1]
    )
  }

  // TODO: Create an unified refresh token
  _setRefreshToken () {
    this._oAuth2Client
      .setCredentials({
        refresh_token: googleCredentials.docs_drive_refresh_token
      })
  }

  get getAuth () {
    this._setRefreshToken()
    return this._oAuth2Client
  }
}

class CalendarAPI extends Credentials {
  constructor () {
    super()
    this.api = google.calendar({ version: 'v3' })
  }
}

class DriveAPI extends Credentials {
  constructor () {
    super()
    this.api = google.drive({ version: 'v3' })
  }

  uploadPDF (fileName, type, data) {
    var fileMetadata = {
      name: fileName
    }

    var media = {
      mimeType: type,
      body: data
    }

    this.api.files.create({
      auth: super.getAuth,
      resource: fileMetadata,
      media: media, // TODO: Check if media can be {}
      fields: 'id'
    }, function (err, file) {
      if (err) {
        console.error(err)
      } else {
        console.log('File Id: ', file.data.id)
      }
    })
  }
}

class GoogleFactory {
  constructor (type) {
    if (type === CALENDAR_API) { return new CalendarAPI() }
    if (type === DRIVE_API) { return new DriveAPI() }
  }
}

module.exports = {
  GoogleFactory,
  CALENDAR_API,
  DRIVE_API,
  PDF_TYPE
}
