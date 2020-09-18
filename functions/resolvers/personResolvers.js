const { SingletonAdmin } = require('../models')

const personResolvers = {
  Query: {
    persons: (_parent, _args, context, _info) => {
      SingletonAdmin.GetInstance().auth().verifyIdToken(context.authScope)
        .then(function (decodedToken) {
          const uid = decodedToken.uid
          const email = decodedToken.email
          console.info(uid)
          console.info(email)
        }).catch(function (error) {
          console.info(error)
        })

      return SingletonAdmin.GetInstance().database()
        .ref('persons')
        .once('value')
        .then(snap => snap.val())
        .then(val => Object.keys(val).map(key => val[key]))
    }
  },
  //  async ({ message })
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
