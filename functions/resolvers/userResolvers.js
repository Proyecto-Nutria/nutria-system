const {
  FirebaseAdmin
} = require('../models')

const {
  FIREBASE_VAL,
  INTERVIEWEE_VAL,
  INTERVIEWER_VAL,
  USER_REF,
  INVITATION_REF,
  INVITATION_EMAIL_ATTR
} = require('./constants')

const {
  getDatabaseReferenceOf
} = require('../utils')

const userResolvers = {
  // TODO: Change the method to be able to do return multiple roles
  /**
   * Creates a new entry in the users' tree, if it's the first time that enters to the
   * system it checks if there is an invitation in the invitations' tree, and creates
\  * @author interviewee interviewer
   * @example
   * {
   *   getUserTypeOrCreate{
   *     role,
   *     firstTime
   *   }
   * }
   * @return {Object}
   */
  Query: {
    getUserTypeOrCreate: (_parent, _args, context) => {
      const uid = context.uid
      return getDatabaseReferenceOf(uid, USER_REF + context.uid)
        .once(FIREBASE_VAL)
        .then(snap => {
          if (snap.exists()) return { role: snap.val().role, firstTime: false }
          const userRef = getDatabaseReferenceOf(uid, USER_REF)
          const invitationRef = getDatabaseReferenceOf(uid, INVITATION_REF)
          return FirebaseAdmin.getAuthInformationFrom(context.uid)
            .then(userRecord => {
              return invitationRef
                .orderByChild(INVITATION_EMAIL_ATTR)
                .equalTo(userRecord.email)
                .once(FIREBASE_VAL)
                .then(invitationSnap => {
                  if (invitationSnap.exists()) {
                    const objectIdKey = Object.keys(invitationSnap.val())[0]
                    invitationRef.child(objectIdKey).update({
                      used: true
                    })
                    userRef.child(context.uid).set({
                      uid: context.uid,
                      rol: INTERVIEWER_VAL,
                      name: userRecord.displayName,
                      email: userRecord.email
                    })
                    return { role: INTERVIEWER_VAL, firstTime: true }
                  }
                  userRef.child(context.uid).set({
                    uid: context.uid,
                    rol: INTERVIEWEE_VAL,
                    name: userRecord.displayName,
                    email: userRecord.email
                  })
                  return { role: INTERVIEWEE_VAL, firstTime: true }
                })
            })
        })
    }
    // TODO: Query interviewee instead of users
    /*
    getAllInterviewees: () => {
      return SingletonAdmin
        .GetInstance()
        .database()
        .ref(USER_REF)
        .orderByChild(USER_ROLE_ATTR)
        .equalTo(INTERVIEWEE_VAL)
        .once(FIREBASE_VAL)
        .then(snap => snap.val())
        .then(val => Object.keys(val).map(key => val[key]))
    } */
  }
}

module.exports = {
  userResolvers
}
