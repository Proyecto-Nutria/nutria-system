const { SingletonAdmin } = require('../models')
const {
  INTERVIEWER_REF
} = require('./constants')

const interviewerResolver = {
  Mutation: {
    createInterviewer: (_, { interviewer }, context) => {
      const interviewerUid = context.uid
      const interviewerRef = SingletonAdmin.GetInstance().database().ref(INTERVIEWER_REF)

      interviewer.uid = interviewerUid
      // Set will overwrite the data at the specified location
      interviewerRef.child(interviewerUid).set(JSON.parse(JSON.stringify(interviewer)))
      return 'Inserted Into Database'
    },
    updateInterviewer: (_, { interviewer }, context) => {
      const interviewerUid = context.uid
      const interviewerRef = SingletonAdmin.GetInstance().database().ref(INTERVIEWER_REF)
      interviewerRef.child(interviewerUid).update(JSON.parse(JSON.stringify(interviewer)))
      return 'Interviewer Updated'
    }
  }
}

module.exports = {
  interviewerResolver
}
