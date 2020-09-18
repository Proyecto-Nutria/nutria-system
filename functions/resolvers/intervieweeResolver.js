const { SingletonAdmin } = require('../models')

const personResolvers = {
  Query: {
    persons: (_parent, _args, context, _info) => {
      SingletonAdmin.GetInstance().auth().verifyIdToken(context.authScope)
        .then(function (decodedToken) {
          const uid = decodedToken.uid
          console.info(uid)
        }).catch(function (error) {
          console.info(error)
        })

      return SingletonAdmin.GetInstance().database()
        .ref('persons')
        .once('value')
        .then(snap => snap.val())
        .then(val => Object.keys(val).map(key => val[key]))
    }
  }
}

module.exports = {
  personResolvers
}
