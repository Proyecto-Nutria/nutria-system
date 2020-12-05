const {
  FirebaseAdmin
} = require('../models')

const {
  FIREBASE_VAL,
  POOL_REF,
  INTERVIEWEE_REF
} = require('./constants')

const {
  getDatabaseReferenceOf,
  forbiddenError
} = require('../utils')

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
    viewPool: (_parent, { _ }, context) => {
      return getDatabaseReferenceOf(context.uid, POOL_REF)
        .once(FIREBASE_VAL)
        .then(snap => snap.val())
        .then(val => {
          if (!val) { return null }
          return Object.keys(val).map(key => {
            val[key].uid = key
            return val[key]
          }
          )
        })
        .catch((error) => { console.log(error); throw forbiddenError() })
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
     *       availability: [
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
    enterToPool: async (_parent, { preferences }, context) => {
      const uid = context.uid
      const poolRef = getDatabaseReferenceOf(uid, POOL_REF)

      preferences.userUid = context.uid
      preferences.person = await FirebaseAdmin.getAuthInformationFrom(uid)
        .then(userRecord => { return userRecord.displayName })
      preferences.folder = await getDatabaseReferenceOf(uid, INTERVIEWEE_REF + uid)
        .once(FIREBASE_VAL)
        .then(snap => {
          if (snap.exists()) return snap.val().folderuid
          return ''
        })
      preferences.priority = 10
      poolRef.push(JSON.parse(JSON.stringify(preferences)))

      return 'Person inserted into the pool'
    }
  }
}

module.exports = {
  poolResolvers
}
