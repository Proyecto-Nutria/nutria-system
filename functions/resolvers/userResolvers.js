// const { SingletonAdmin } = require('../models')

const { SingletonAdmin } = require('../models')

const userResolvers = {
  Query: {
    getUserType: (_parent, _args, context, _info) => {
      var databaseInstance = SingletonAdmin.GetInstance()
      return databaseInstance.database()
        .ref('users/' + context.uid)
        .once('value')
        .then(snap => {
          if (snap.exists()) {
            var userSnap = snap.val()
            const objectIdKey = Object.keys(userSnap)[0]
            return [userSnap[objectIdKey].rol, false]
          } else {
            // TODO: Validate if the header has the special link to register user as interviewer
            const userRef = databaseInstance.database().ref('users/')
            userRef.child(context.uid).set({ uid: context.uid, rol: 'interviewee' })
            return ['interviewee', true]
          }
        })
    },
    getAllInterviewees: () => {
      return SingletonAdmin.GetInstance().database().ref('users/')
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
