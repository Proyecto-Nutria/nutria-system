const { SingletonAdmin } = require('../models')
const {
  INTERVIEWEE_REF
} = require('./constants')

const intervieweeResolver = {
  Mutation: {
    createInterviewee: (_parent, { interviewee }, context) => {
      const intervieweeUid = context.uid
      const intervieweeRef = SingletonAdmin.GetInstance().database().ref(INTERVIEWEE_REF)

      interviewee.uid = intervieweeUid
      // Set will overwrite the data at the specified location
      intervieweeRef.child(intervieweeUid).set(JSON.parse(JSON.stringify(interviewee)))
      return 'Inserted Into Database'
    }
  }
}

module.exports = {
  intervieweeResolver
}
