const { SingletonAdmin } = require('../models')

const personResolvers = {
  Query: {
    //  persons: (_parent, _args, context, _info) => {
    /*
    persons: (_parent, _args, context, _info) => {
      return SingletonAdmin.GetInstance().database()
        .ref('persons')
        .once('value')
        .then(snap => snap.val())
        .then(val => Object.keys(val).map(key => val[key]))
    }, */
    users: () => {
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
