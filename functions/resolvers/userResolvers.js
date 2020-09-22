// const { SingletonAdmin } = require('../models')

const { SingletonAdmin } = require('../models')

const userResolvers = {
  Query: {
    getUserType: (_parent, _args, context, _info) => {
      var databaseInstance = SingletonAdmin.GetInstance()
      return databaseInstance.database()
        .ref('users')
        .orderByChild('uid')
        .equalTo(context.uid)
        .once('value')
        .then(snap => {
          if (snap.exists()) {
            var userSnap = snap.val()
            const objectIdKey = Object.keys(userSnap)[0]
            return [userSnap[objectIdKey].rol, false]
          } else {
          // TODO: Validate if the header has the special link to register user as interviewer
            databaseInstance.database().ref('users/').push({
              uid: context.uid,
              rol: 'interviewee'
            })
            return ['interviewee', true]
          }
        })
    }
  },
  Mutation: {
    createUser: async (_, { user }) => {
      console.log(user)
      return 'Inserted into database'
    }
  }
}

module.exports = {
  userResolvers
}
