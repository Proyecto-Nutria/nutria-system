const { SingletonAdmin } = require('../models')
const {
  FIREBASE_VAL,
  POOL_REF
} = require('./constants')

const poolResolvers = {
  Query: {
    /**
     * Views the pool, the pool is used to see all the persons that want an interview
     * and their preferences about the type of interview that they would like to do
     * @author interviewer
     * @example
     * {
     *   viewPool{
     *     uid,
     *     availability{
     *       day,
     *       interval
     *     }
     *   }
     * }
     * @return {Object[]} Pool
     */
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
    /**
     *  Creates a new entry in the pool's tree, it creates a priority to know which
     * interviewee need more urgently an interview
     * @author interviewee
     * @param {object} PoolInput
     * @example
     * mutation {
     *   enterToPool(
     *     preferences: {
     *       companies: [Google]
     *       interval: [
     *         {
     *           day: "monday",
     *           interval: ["12-14", "14-16"]
     *         },
     *         {
     *           day: "friday",
     *           interval: ["12-14", "14-16"]
     *         }
     *       ]
     *       language: [python]
     *       pending: 2
     *       role: FTE
     *       type: se
     *     }
     *   )
     * }
     * @return {String}
     */
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
  poolResolvers
}
