const { SingletonAdmin } = require('../models')
const {
  FIREBASE_VAL,
  POOL_REF
} = require('./constants')

const poolResolver = {
  Query: {
    viewPool: () => {
      return SingletonAdmin
        .GetInstance()
        .database()
        .ref(POOL_REF)
        .once(FIREBASE_VAL)
        .then(snap => snap.val())
        .then(val => Object.keys(val).map(key => val[key]))
    }
  },
  Mutation: {
    enterToPool: (_parent, { preferences }, context) => {
      const poolRef = SingletonAdmin.GetInstance().database().ref(POOL_REF)
      preferences.uid = context.uid
      preferences.priority = 10
      poolRef.push(JSON.parse(JSON.stringify(preferences)))

      return 'Person inserted into the pool'
    }
  }
}

module.exports = {
  poolResolver
}