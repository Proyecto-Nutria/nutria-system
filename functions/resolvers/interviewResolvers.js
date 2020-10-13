const fs = require('fs')
const path = require('path')

const {
  GoogleFactory,
  CALENDAR_API,
  SingletonAdmin
} = require('../models')
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
          JSON.parse(JSON.stringify(interview))
        )
      return 'Inserted Into Database'
    },
    // TODO: Document all the Mutations and the Querys, JSDoc is an option
    // TODO: Create the template and send and email
    /**
     * @param interview {Object} The request.
     * @return {String}
    */
    cancelInterview: (_, { interviewUid }) => {
      SingletonAdmin
        .GetInstance()
        .database()
        .ref(INTERVIEW_REF)
        .child(interviewUid)
        .remove()
      return 'Interview Canceled'
    },
    confirmInterview: async (_, { interviewUid, interviewDate }) => {
      const roomRef = SingletonAdmin.GetInstance().database().ref(ROOM_REF)

      // Step 1: Find an available room
      const date = new Date(Number(interviewDate))
      const day = date.getDate()
      const month = date.getMonth() + 1 // returns 1 less than month
      const year = date.getFullYear().toString().slice(-2)
      const interviewDateFormat = `${day}-${month}-${year}`
      const interviewBeginning = date.getHours()
      const interviewEnding = interviewBeginning + 2

      const { emptySnap, undefinedRoom, possibleRoom, prevIntervals } = await roomRef
        // Sub filter by date of all rooms
        .orderByChild(interviewDateFormat + ROOM_DATE_ATTR)
        .equalTo(interviewDateFormat)
        .once(FIREBASE_VAL)
        .then(snap => snap.val())
        .then(val => {
          var undefinedRoom = false
          if (val === null) return { emptySnap: true, undefinedRoom: undefinedRoom, possibleRoom: 1, prevIntervals: [] }

          var possibleRoom = 1
          var prevIntervals = []
          var currentRoomNumber
          for (currentRoomNumber = 1; currentRoomNumber <= 10; currentRoomNumber++) {
            const currentRoom = val[currentRoomNumber]
            if (typeof currentRoom === 'undefined') {
              undefinedRoom = true
              break
            }
            var roomFound = true
            const intervals = currentRoom[interviewDateFormat].intervals

            for (const interval of intervals) {
              const cleanedInterval = interval.split('-')
              const intervalBeginning = cleanedInterval[0]
              const intervalEnding = cleanedInterval[1]
              if (
                (interviewBeginning > intervalBeginning && interviewBeginning < intervalEnding) ||
                (interviewEnding > intervalBeginning && interviewEnding < intervalEnding) ||
                (interviewEnding === intervalBeginning && interviewEnding === intervalEnding)
              ) {
                possibleRoom += 1
                roomFound = false
                break
              }
            }
            prevIntervals = intervals
            if (roomFound === true) break
          }
          return { emptySnap: false, undefinedRoom: undefinedRoom, possibleRoom: possibleRoom, prevIntervals: prevIntervals }
        })

      // Step 2: Add the new interval to the room
      const intervalFormat = `${interviewBeginning}-${interviewEnding}`
      if (emptySnap === true || undefinedRoom === true) {
        roomRef.child(possibleRoom).child(interviewDateFormat).set(
          {
            date: interviewDateFormat,
            intervals: [intervalFormat]
          }
        )
      } else {
        const updatedIntervals = [
          ...prevIntervals,
          intervalFormat
        ]
        // Note: Firebase 'ArrayUnionTransform' wasn't working properly
        roomRef.child(possibleRoom).child(interviewDateFormat).update({
          intervals: updatedIntervals
        })
      }

      // Step 3: Update the status of the interview
      const interviewRef = SingletonAdmin.GetInstance().database().ref(INTERVIEW_REF)
      interviewRef
        .child(interviewUid)
        .update({ confirmed: true })

      // Step 4: Create the event in the calendar
      // TODO: Get the email of the interviewers
      const driveAPI = new GoogleFactory(CALENDAR_API)
      driveAPI.createEvent(possibleRoom, interviewDate)

      // Step 5: Create the docs in the user's folder

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
