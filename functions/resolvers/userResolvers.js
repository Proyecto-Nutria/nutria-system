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
            userRef.child(context.uid).set({ rol: 'interviewee' })
            return ['interviewee', true]
          }
        })
    }
  },
  Mutation: {
    createUserInterviewee: async (_parent, _args, context, _info) => {
      console.log(SingletonAdmin.GetInstance().database().ref('users/' + context.uid))
      /* await SingletonAdmin.GetInstance().database().ref('users/').push({
        name: user
      }) */
      return 'Inserted into database'
    }
  }
}

module.exports = {
  userResolvers
}
