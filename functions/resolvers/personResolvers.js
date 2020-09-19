const { SingletonAdmin } = require('../models')

const personResolvers = {
  Query: {
    //  persons: (_parent, _args, context, _info) => {
    persons: (_parent, _args, context, _info) => {
      return SingletonAdmin.GetInstance().database()
        .ref('persons')
        .once('value')
        .then(snap => snap.val())
        .then(val => Object.keys(val).map(key => val[key]))
    },
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
            return [userSnap[objectIdKey].rol, userSnap[objectIdKey].rol === 'interviewee']
          } else {
          // TODO: Validate if the header has the special link to register user as interviewer
            databaseInstance.database().ref('users/').push({
              uid: context.uid,
              rol: 'interviewee'
            })
            return ['interviewee', false]
          }
        })
    },
    users: () => {
      console.log('touched something')
      return SingletonAdmin.GetInstance().database()
        .ref('users')
        .once('value')
        .then(snap => snap.val())
        .then(val => Object.keys(val).map(key => val[key]))
    }
  },
  Mutation: {
    setMessage: async (_, { message }) => {
      console.log(message)
      await SingletonAdmin.GetInstance().database().ref('users/').push({
        name: message
      })
      return 'Inserted into database'
    }
  }
}

module.exports = {
  personResolvers
}
