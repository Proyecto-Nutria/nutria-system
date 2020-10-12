const fs = require('fs')
const path = require('path')

const { SingletonAdmin } = require('../models')
const {
  FIREBASE_VAL,
  ROOM_REF,
  ROOM_DATE_ATTR,
  INTERVIEW_REF,
  INTERVIEW_INTERVIEWEE_UIDDATE
} = require('./constants')

const sgMail = require('@sendgrid/mail')
const sendgridCredentials = require('../config/sendgrid-credentials.json')

const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const googleCalendar = google.calendar({ version: 'v3' })
const googleDrive = google.drive({ version: 'v3' })
const googleCredentials = require('../config/google-credentials.json')

const interviewResolvers = {
  Query: {
    getIncomingInterviews: (_parent, { user }, context) => {
      return SingletonAdmin
        .GetInstance()
        .database()
        .ref(INTERVIEW_REF)
        .orderByChild(INTERVIEW_INTERVIEWEE_UIDDATE)
        .startAt(`${context.uid}_${Date.now()}`)
        .once(FIREBASE_VAL)
        .then(snap => snap.val())
        .then(val => Object.keys(val).map(key => {
          val[key].uid = key
          return val[key]
        }))
    }
  },
  Mutation: {
    createInterview: (_, { interview }) => {
      const userRef = SingletonAdmin.GetInstance().database().ref(INTERVIEW_REF)
      userRef
        .push(
          JSON.parse(
            JSON.stringify(interview)
          )
        )
      return 'Inserted Into Database'
    },
    // TODO: Document all the Mutations and the Querys, JSDoc is an option
    // TODO: Create the template and send and email
    /**
     * @param interview {Object} The request.
     * @return {String}
    */
    cancelInterview: (_, { interviewId }) => {
      SingletonAdmin
        .GetInstance()
        .database()
        .ref(INTERVIEW_REF)
        .child(interviewId)
        .remove()
      return 'Interview Canceled'
    },
    confirmInterview: async (_, { interview }) => {
      // Confirm the interview in the database
      /*
      const interviewRef = SingletonAdmin
        .GetInstance()
        .database()
        .ref('interviews/' + interview.id)

      interviewRef
        .update({ status: 'confirmed' }) */

      SingletonAdmin
        .GetInstance()
        .database()
        .ref(ROOM_REF)
        .orderByChild('20dec20' + ROOM_DATE_ATTR)
        .equalTo('20dec20')
        .once(FIREBASE_VAL)
        .then(snap => {
          const userBHour = 1
          const userEHour = 3
          var possibleRoom = 1
          const allIntervals = snap.val()
          const currentDate = '20dec20'
          var currentRoomNumber
          for (currentRoomNumber = 1; currentRoomNumber <= 1; currentRoomNumber++) {
            const currentRoom = 'room' + currentRoomNumber
            const intervals = allIntervals[currentRoom][currentDate].intervals
            console.log(intervals)
            for (const interval of intervals) {
              const cleanedInterval = interval.split('-')

              if ((userBHour > cleanedInterval[0] && userBHour < cleanedInterval[1]) ||
              (userEHour > cleanedInterval[0] && userEHour < cleanedInterval[1])) {
                possibleRoom += 1
                break
              }
            }
            break
          }

          console.log('Room will be' + possibleRoom)
        })
        // .then(val => console.log(Object.keys(val).map(key => val[key])))
        // .then(val => console.log(val))

      // TODO:- Select a room
      // TODO: - Change the refresh token to use all the permission needed
      // instead of multiple refresh tokens
      // TODO: Catch errors coming from Google API
      const oAuth2Client = new OAuth2(
        googleCredentials.web.client_id,
        googleCredentials.web.client_secret,
        googleCredentials.web.redirect_uris[1]
      )

      oAuth2Client
        .setCredentials({
          refresh_token: googleCredentials.docs_drive_refresh_token
        })

      const eventData = {
        eventName: 'Firebase testing',
        description: 'Test',
        starTime: new Date(),
        endTime: new Date()
      }

      // Create the event for the interviewer
      /*
      googleCalendar
        .events
        .insert({
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
        })
        .catch((error) => {
          console.error(error)
        }) */

      // Get the folder id where the doc is going to be
      /*
      var folderId = await googleDrive
        .files
        .list({
          auth: oAuth2Client,
          q: "mimeType='application/vnd.google-apps.folder' and name='NutriPerson2'",
          fields: 'nextPageToken, files(id, name)',
          spaces: 'drive',
          pageToken: null
        })
        .then(value => {
          const folderInformation = value.data.files
          if (folderInformation === undefined || folderInformation.length === 0) {
            return ''
          }
          return folderInformation[0].id
        })
        .catch((error) => {
          console.error(error)
        }) */

      // If the folder does not exist, create a new one
      /*
      if (folderId === '') {
        const folderMetadata = {
          name: 'DummyFolder',
          parents: [googleCredentials.interview_folder_id],
          mimeType: 'application/vnd.google-apps.folder'
        }

        folderId = await googleDrive
          .files
          .create({
            auth: oAuth2Client,
            fields: 'id',
            resource: folderMetadata
          })
          .then(value => {
            return value.data.id
          })
          .catch((error) => {
            console.error(error)
          })
      } */

      // Create the google docs inside the folder
      /*
      const fileMetadata = {
        name: 'Interview Doc',
        parents: [folderId],
        mimeType: 'application/vnd.google-apps.document'
      }

      const googleDocId = await googleDrive
        .files
        .create({
          auth: oAuth2Client,
          fields: 'id',
          resource: fileMetadata
        })
        .then(value => {
          return value.data.id
        })
        .catch((error) => {
          console.error(error)
        }) */

      // Change the permissions of the google doc
      /*
      googleDrive
        .permissions
        .create(
          {
            auth: oAuth2Client,
            fields: 'id',
            fileId: googleDocId,
            resource: {
              type: 'anyone',
              role: 'writer'
            }
          }
        ).catch((error) => {
          console.error(error)
        }) */

      // Be careful, this may be a production service. Calendar
      // it means that people want to avoid because local testing is meant to be hermetic

      // Send the email to the user with the final information
      /*
      const openFile = (filePath) => fs.readFileSync(path.resolve(__dirname, filePath), 'utf8')
      const header = openFile('../template/header.html')
      const content = openFile('../template/content.html').replace('[[username]]', 'Nutria Name')
      const footer = openFile('../template/footer.html')

      sgMail.setApiKey(sendgridCredentials.api_key)
      const msg = {
        to: 'reyesfragosoroberto@gmail.com',
        from: 'proyecto.nutria.escom@gmail.com',
        subject: 'Interview Remainder', // TODO: Add day of the interview
        html: header.concat(content, footer)
      }
      sgMail
        .send(msg)
        .catch((error) => {
          console.error(error)
        }) */

      return 'Interview Confirmed'
    }
  }
}

module.exports = {
  interviewResolvers
}
