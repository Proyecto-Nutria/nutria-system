const admin = require('firebase-admin')
const { SingletonAdmin } = require('../models')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const calendar = google.calendar({
  version: 'v3'
})
const docs = google.docs(
  {
    version: 'v1'
  }
)
const {
  FIREBASE_VAL,
  INTERVIEWEE_VAL,
  USER_REF,
  USER_ROLE_ATTR,
  INTERVIEWEE_REF
} = require('./constants')

const drive = google.drive({ version: 'v3' })

const googleCredentials = require('../config/google-credentials.json')

const userResolvers = {
  Query: {
    getUserType: (_parent, _args, context, _info) => {
      var databaseInstance = SingletonAdmin.GetInstance()
      return databaseInstance.database()
        .ref('users/' + context.uid)
        .once('value')
        .then(snap => {
          if (snap.exists()) return [snap.val().rol, false]
          const userRef = databaseInstance.database().ref('users/')
          const invitationRef = databaseInstance.database().ref('invitations/')
          return admin.auth().getUser(context.uid)
            .then(userRecord => {
              return invitationRef
                .orderByChild('email')
                .equalTo(userRecord.email)
                .once('value')
                .then(invitationSnap => {
                  if (invitationSnap.exists()) {
                    const objectIdKey = Object.keys(invitationSnap.val())[0]
                    invitationRef.child(objectIdKey).update({
                      used: true
                    })
                    userRef.child(context.uid).set({
                      uid: context.uid,
                      rol: 'interviewer'
                    })
                    return ['Interviewer First Time', true]
                  }
                  userRef.child(context.uid).set({
                    uid: context.uid,
                    rol: 'interviewee'
                  })
                  return ['interviewee', true]
                })
            })
        })
    },
    // TODO: Query interviewee instead of users
    getAllInterviewees: () => {
      const eventData = {
        eventName: 'Firebase testing',
        description: 'Test',
        starTime: new Date(),
        endTime: new Date()
      }

      const oAuth2Client = new OAuth2(
        googleCredentials.web.client_id,
        googleCredentials.web.client_secret,
        googleCredentials.web.redirect_uris[1]
      )

      oAuth2Client.setCredentials({
        refresh_token: googleCredentials.docs_drive_refresh_token
      })

      // Todo: Catch errors coming from Google API
      /* calendar.events.insert({
        auth: oAuth2Client,
        calendarId: 'primary',
        resource: {
          summary: eventData.eventName,
          start: {
            dateTime: eventData.starTime,
            timezone: 'EST'
          },
          end: {
            dateTime: eventData.starTime,
            timezone: 'EST'
          }
        }
      }).then(console.log('Calendar')) */

      /*
      docs.documents.create({
        auth: oAuth2Client,
        documentId: 'firebase-id-test',
        resource: {
          title: 'firebase-name-test'
        }
      }).then(data => console.log(data.data.documentId)) */

      var pageToken = null

      drive.files.list({
        auth: oAuth2Client,
        q: "mimeType= 'application/vnd.google-apps.folder' and name='FirebaseTesting'",
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
        pageToken: pageToken
      }, function (err, res) {
        if (err) {
          // Handle error
          console.error(err)
        } else {
          res.data.files.forEach(function (file) {
            console.log('Found file: ', file.name, file.id)
          })
        }
      })
      /*
      var fileMetadata = {
        name: 'Firebase Doc',
        parents: [''], #Folder Id
        mimeType: 'application/vnd.google-apps.document'
        // title: 'Document'
      }
      drive.files.create({
        auth: oAuth2Client,
        resource: fileMetadata,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          // Handle error
          console.error(err)
        } else {
          console.log('Folder Id: ', file.data.id)
        }
      }) */

      // Be careful, this may be a production service. Calendar
      // it means that people want to avoid because local testing is meant to be hermetic

      return SingletonAdmin
        .GetInstance()
        .database()
        .ref(USER_REF)
        .orderByChild(USER_ROLE_ATTR)
        .equalTo(INTERVIEWEE_VAL)
        .once(FIREBASE_VAL)
        .then(snap => snap.val())
        .then(val => Object.keys(val).map(key => val[key]))
    }
  },
  Mutation: {
    createUserInterviewee: (_parent, { user }, context) => {
      const userUid = context.uid
      const userRef = SingletonAdmin.GetInstance().database().ref(USER_REF)
      const intervieweeRef = SingletonAdmin.GetInstance().database().ref(INTERVIEWEE_REF)

      user.interviewee.uid = userUid
      userRef.child(userUid).update({ email: user.email, name: user.name })
      // Set will overwrite the data at the specified location
      intervieweeRef.child(userUid).set(JSON.parse(JSON.stringify(user.interviewee)))
      return 'Inserted Into Database'
    }
  }
}

module.exports = {
  userResolvers
}
