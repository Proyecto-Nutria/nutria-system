const { SingletonAdmin } = require('../models')
const {
  INTERVIEWEE_REF
} = require('./constants')

const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const googleDrive = google.drive({ version: 'v3' })
const googleCredentials = require('../config/google-credentials.json')

const intervieweeResolver = {
  Mutation: {
    createInterviewee: async (_parent, { file }, context) => {
      const { stream, filename, mimetype, encoding } = await file

      // TODO: Create a method to create the instance of each google api

      const oAuth2Client = new OAuth2(
        googleCredentials.web.client_id,
        googleCredentials.web.client_secret,
        googleCredentials.web.redirect_uris[1]
      )

      oAuth2Client
        .setCredentials({
          refresh_token: googleCredentials.docs_drive_refresh_token
        })

      var fileMetadata = {
        name: 'resume.pdf'
      }
      var media = {
        mimeType: 'application/pdf',
        body: stream
      }

      googleDrive.files.create({
        auth: oAuth2Client,
        resource: fileMetadata,
        media: media,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          // Handle error
          console.error(err)
        } else {
          console.log('File Id: ', file.data.id)
        }
      })

      /*
      const intervieweeUid = context.uid
      const intervieweeRef = SingletonAdmin.GetInstance().database().ref(INTERVIEWEE_REF)

      interviewee.uid = intervieweeUid
      // Set will overwrite the data at the specified location
      intervieweeRef.child(intervieweeUid).set(JSON.parse(JSON.stringify(interviewee))) */

      return 'Inserted Into Database'
    }
  }
}

module.exports = {
  intervieweeResolver
}
