const admin = require('firebase-admin')
const {
  SingletonAdmin,
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

const userResolvers = {
  Query: {
    getUserType: (_parent, _args, context, _info) => {
      var databaseInstance = SingletonAdmin.GetInstance()
      return databaseInstance
        .database()
        .ref(USER_REF + context.uid)
        .once(FIREBASE_VAL)
        .then(snap => {
          if (snap.exists()) return [snap.val().role, false]
          const userRef = databaseInstance.database().ref(USER_REF)
          const invitationRef = databaseInstance.database().ref(INVITATION_REF)
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
                    return [INTERVIEWER_VAL, true]
                  }
                  userRef.child(context.uid).set({
                    uid: context.uid,
                    rol: INTERVIEWEE_VAL,
                    name: userRecord.displayName,
                    email: userRecord.email
                  })
                  return [INTERVIEWEE_VAL, true]
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
