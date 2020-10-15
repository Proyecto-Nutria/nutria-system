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
} = require('./constants')

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
    /**
     * @param interview {Object} The request.
     * @return {String}
    */
    cancelInterview: async (_, { cancellation }) => {
      const { interviewDateFormat, interviewBeginning } = timestampToDate(cancellation.interviewDate)

      SingletonAdmin
        .GetInstance()
        .database()
        .ref(INTERVIEW_REF)
        .child(cancellation.interviewUid)
        .remove()

      const intervieweeEmail = (await FirebaseAdmin.getAuthInformationFrom(cancellation.interviewerUid)).email
      const gmailAPI = new GoogleFactory(GMAIL_API)
      await gmailAPI.sendCancellationEmail(
        intervieweeEmail,
        interviewDateFormat,
        interviewBeginning)

      return 'Interview Canceled'
    },
    confirmInterview: async (_, { confirmation }, context) => {
      const roomRef = SingletonAdmin.GetInstance().database().ref(ROOM_REF)
      const { interviewDateFormat, interviewBeginning, interviewEnding } = timestampToDate(confirmation.interviewDate)

      // Step 1: Find an available room
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
              const intervalBeginning = parseInt(cleanedInterval[0], 10)
              const intervalEnding = parseInt(cleanedInterval[1], 10)
              if (
                (interviewBeginning > intervalBeginning && interviewBeginning < intervalEnding) ||
                (interviewEnding > intervalBeginning && interviewEnding < intervalEnding) ||
                (interviewBeginning === intervalBeginning && interviewEnding === intervalEnding)
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
        .child(confirmation.interviewUid)
        .update({ confirmed: true })

      // Step 4: Create the event in the calendar
      // Note: Be careful, this may be a production service it means that people want to
      // avoid because local testing is meant to be hermetic
      const interviewerEmail = (await FirebaseAdmin.getAuthInformationFrom(context.uid)).email
      const calendarAPI = new GoogleFactory(CALENDAR_API)
      calendarAPI.createEvent(possibleRoom, confirmation.interviewDate, interviewerEmail)

      // Step 5: Search interviewee's google folder and create a new google doc
      const driveAPI = new GoogleFactory(DRIVE_API)
      const intervieweeFolderId = await driveAPI.getResourceId(FOLDER_TYPE, context.uid)
      if (intervieweeFolderId === '') {
        return 'Interviewee folder does not exist'
      }

      // Step 6: Create the google docs inside the folder and change its permissions
      const docId = await driveAPI.createResource(`Interview ${interviewDateFormat}`, DOC_TYPE, intervieweeFolderId)
      driveAPI.changePermissionsOf(docId)

      // Step 7: Send the email to the final user with all the information
      const intervieweeEmail = (await FirebaseAdmin.getAuthInformationFrom(confirmation.intervieweeUid)).email
      const gmailAPI = new GoogleFactory(GMAIL_API)
      await gmailAPI.sendConfirmationEmail(intervieweeEmail,
        possibleRoom,
        interviewDateFormat,
        interviewBeginning,
        docId)

      return 'Interview Confirmed'
    }
  }
}

function timestampToDate (timestamp) {
  const date = new Date(Number(timestamp))
  const day = date.getDate()
  const month = date.getMonth() + 1 // returns 1 less than month
  const year = date.getFullYear().toString().slice(-2)
  const interviewDateFormat = `${day}-${month}-${year}`
  const interviewBeginning = date.getHours()
  const interviewEnding = interviewBeginning + 2
  return {
    interviewDateFormat: interviewDateFormat,
    interviewBeginning: interviewBeginning,
    interviewEnding: interviewEnding
  }
}

module.exports = {
  interviewResolvers
}
