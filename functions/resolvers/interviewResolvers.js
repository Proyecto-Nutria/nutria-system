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
  INTERVIEW_INTERVIEWEE_UIDDATE,
  POOL_REF
} = require('./constants')

const interviewResolvers = {
  Query: {
    /**
     * Gets all interviews less than the day and hour when the query is invoked
     * @author interviewee interviewer
     * @example
     * {
     *  getIncomingInterviews{
     *    uid,
     *    date
     *   }
     * }
     * @return {Object[]} Interview
     */
    getPastsInterviews: (_parent, _args, context) => {
      return SingletonAdmin
        .GetInstance()
        .database()
        .ref(INTERVIEW_REF)
        .orderByChild(INTERVIEW_INTERVIEWEE_UIDDATE)
        .endAt(`${context.uid}_${Date.now()}`)
        .once(FIREBASE_VAL)
        .then(snap => snap.val())
        .then(val => Object.keys(val).map(key => {
          val[key].uid = key
          return val[key]
        }))
    },
    /**
     * Gets all interviews greater than the day and hour when the query is invoked
     * @author interviewee interviewer
     * @example
     * {
     *  getIncomingInterviews{
     *    uid,
     *    date
     *   }
     * }
     * @return {Object[]} Interview
     */
    getIncomingInterviews: (_parent, _args, context) => {
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
    /**
     * Creates a new entry in the interviews' tree, updates the status of the entry in
     * pool's tree decreasing by 1 the pending interviews, if the pending is 0 the elem
     * is eliminated from the database.
     * @author interviewer
     * @param {object} InterviewInput
     * @example
     * mutation {
     *  createInterview(
     *    interview:{
     *      intervieweeUid: "uid",
     *      date : "1608451200000",
     *      poolId: "poolUid".
     *      pending: 2
     *     }
     *   )
     * }
     * @return {String}
     */
    createInterview: (_parent, { interview }, context) => {
      const interviewDate = interview.date
      const interviewObj = {
        confirmed: false,
        date: interviewDate,
        intervieweeUid_date: `${context.uid}_${interviewDate}`,
        interviewerUid_date: `${interview.intervieweeUid}_${interviewDate}`
      }

      const userRef = SingletonAdmin.GetInstance().database().ref(INTERVIEW_REF)
      userRef
        .push(
          JSON.parse(JSON.stringify(interviewObj))
        )

      const poolRef = SingletonAdmin.GetInstance().database().ref(POOL_REF)
      const pendingInterviews = interview.pending - 1
      if (pendingInterviews === 0) {
        poolRef
          .child(interview.poolId)
          .remove()
      } else {
        poolRef
          .child(interview.poolId)
          .update({ pending: pendingInterviews })
      }

      return 'Inserted Into Database'
    },
    /**
     * Deletes an interview in interviews' tree and sends an email to the interviewer
     * notifying about the cancellation
     * @author interviewee interviewer
     * @param {object} CancellationInput
     * @example
     * mutation {
     *  cancelInterview(
     *    cancellation:{
     *      interviewUid: "uid",
     *      interviewerUid : "uid",
     *      interviewDate: "1608451200000"
     *     }
     *   )
     * }
     * @return {String}
     */
    cancelInterview: async (_parent, { cancellation }) => {
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
    /**
     * Creates a new entry in the rooms' tree, updates the status of the interview in
     * interview's tree, creates an event in google calendars and puts the interviewer
     * as guest, creates the google doc for the interview and sends an email as a
     * reminder for the interviewee if there is a room available to do the interview
     * @author interviewee
     * @param {object} ConfirmationInput
     * @example
     * mutation {
     *  confirmInterview(
     *    confirmation:{
     *      interviewUid: "uid",
     *      intervieweeUid : "uid",
     *      interviewDate: "1608451200000"
     *     }
     *   )
     * }
     * @return {String}
     */
    confirmInterview: async (_parent, { confirmation }, context) => {
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
