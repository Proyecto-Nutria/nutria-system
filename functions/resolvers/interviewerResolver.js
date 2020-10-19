const { SingletonAdmin } = require('../models')
const {
  INTERVIEWER_REF
} = require('./constants')

const interviewerResolver = {
  Mutation: {
    /**
     * Creates a new entry in the interviewers' tree
     * @author interviewer
     * @param {object} InterviewerInput
     * @example
     * mutation {
     *   createInterviewer(
     *     interviewer: {
     *       isMentioned: true
     *       description: "I love project Nutria"
     *     }
     *   )
     * }
     * @return {String}
     */
    createInterviewer: (_parent, { interviewer }, context) => {
      const interviewerUid = context.uid
      const interviewerRef = SingletonAdmin.GetInstance().database().ref(INTERVIEWER_REF)

      interviewer.uid = interviewerUid
      // Set will overwrite the data at the specified location
      interviewerRef.child(interviewerUid).set(JSON.parse(JSON.stringify(interviewer)))
      return 'Inserted Into Database'
    },
    /**
     * Updates the information of the interviewer
     * @author interviewer
     * @param {object} InterviewerInput
     * @example
     * mutation {
     *   updateInterviewer(
     *     interviewer: {
     *       isMentioned: false
     *       description: "I love Nutria"
     *     }
     *   )
     * }
     * @return {String}
     */
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
