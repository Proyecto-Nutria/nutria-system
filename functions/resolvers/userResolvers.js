// const { SingletonAdmin } = require('../models')

const admin = require('firebase-admin')
const { SingletonAdmin } = require('../models')

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
      return SingletonAdmin.GetInstance().database()
        .ref('users/')
        .orderByChild('rol')
        .equalTo('interviewee')
        .once('value')
        .then(snap => snap.val())
        .then(val => Object.keys(val).map(key => val[key]))
    }
  },
  Mutation: {
    createUserInterviewee: (_parent, { user }, context) => {
      const userUid = context.uid
      const userRef = SingletonAdmin.GetInstance().database().ref('users/')
      const intervieweeRef = SingletonAdmin.GetInstance().database().ref('interviewee/')
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
