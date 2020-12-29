const {
  INTERVIEWER_REF
} = require('./constants')

const {
  getDatabaseReferenceOf,
  forbiddenError
} = require('../utils')

const interviewerResolvers = {
  Mutation: {
    /**
     * Creates a new entry in the interviewers' tree
     * @author interviewer
     * @param {object} String Email of the interviewer
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
      const interviewerRef = getDatabaseReferenceOf(interviewerUid, INTERVIEWER_REF)

      interviewer.uid = interviewerUid
      interviewerRef
        .child(interviewerUid)
        .set(JSON.parse(JSON.stringify(interviewer)))
        .catch(e => { console.error(e); throw forbiddenError() })

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
    updateInterviewer: async (_parent, { interviewer }, context) => {
      const interviewerUid = context.uid
      const interviewerRef = getDatabaseReferenceOf(interviewerUid, INTERVIEWER_REF)
      await interviewerRef
        .child(interviewerUid)
        .update(JSON.parse(JSON.stringify(interviewer)))
        .catch(e => { console.error(e); throw forbiddenError() })
      return 'Interviewer Updated'
    }
  }
}

module.exports = {
  interviewerResolvers
}
