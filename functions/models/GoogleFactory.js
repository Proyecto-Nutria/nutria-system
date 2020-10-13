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

  async createEvent (roomNumber, initialDate) {
    const twoHoursInTimestamp = 7200000
    const eventData = {
      summary: 'Nutria Interview',
      location: `room ${roomNumber}`,
      start: {
        dateTime: initialDate,
        timeZone: 'EST'
      },
      end: {
        dateTime: new Date(Number(initialDate) + twoHoursInTimestamp),
        timeZone: 'EST'
      }
      /*,
      attendees: [
        { email: 'lpage@example.com' }
      ] */
    }

    return await this
      .api
      .events
      .insert({
        auth: super.getAuth,
        calendarId: 'primary',
        resource: eventData
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

class DriveAPI extends Credentials {
  constructor () {
    super()
    this.api = google.drive({ version: 'v3' })
  }

  async createResource (name, type, parentFolderId = null, data = null) {
    if (parentFolderId === null) {
      parentFolderId = googleCredentials.interview_folder_id
    }

    var metadata = {
      name: name,
      parents: [parentFolderId]
    }
    var file = {}

    if (data === null) {
      metadata.mimeType = type
    } else {
      file = {
        mimeType: type,
        body: data
      }
    }

    return await this
      .api
      .files
      .create({
        auth: super.getAuth,
        resource: metadata,
        media: file,
        fields: 'id'
      })
      .then(value => {
        return value.data.id
      })
      .catch((error) => {
        console.error(error)
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
  PDF_TYPE,
  FOLDER_TYPE
}
