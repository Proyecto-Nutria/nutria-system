const { SingletonAdmin } = require('../models')

const personResolvers = {
  Query: {
    persons: (_parent, _args, context, _info) => {
      console.info(context.authScope)
      return new SingletonAdmin.GetInstance().database()
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
