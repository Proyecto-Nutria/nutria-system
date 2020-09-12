const { SingletonAdmin } = require('../models')

const personResolvers = {
  Query: {
    persons: () => {
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
