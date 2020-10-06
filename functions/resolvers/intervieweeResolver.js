const { SingletonAdmin } = require('../models')
const {
  INTERVIEWEE_REF
} = require('./constants')

const intervieweeResolver = {
  Mutation: {
    createInterviewee: (_parent, { user }, context) => {
      const userUid = context.uid
      const intervieweeRef = SingletonAdmin.GetInstance().database().ref(INTERVIEWEE_REF)

      user.interviewee.uid = userUid
      // Set will overwrite the data at the specified location
      intervieweeRef.child(userUid).set(JSON.parse(JSON.stringify(user.interviewee)))
      return 'Inserted Into Database'
    }
  }
}

module.exports = {
  intervieweeResolver
}
