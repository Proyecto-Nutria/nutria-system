const { gql } = require('apollo-server-express')

const query = gql`
  type Query {
    # User
    getUserType: [String],
    # Interviews
    getIncomingInterviews: [Interview],
    # Interviewee
    getAllInterviewees: [User]
  }
  type Mutation{
    setMessage(message: String): String,
    # Interviewer
    createInterviewer(interviewer: InterviewerInput): String,
    # Interviewee
    # createInterviewee(interviewee: IntervieweeInput): String,
    createInterviewee(interviewee: IntervieweeInput): String,
    enterToPool(preferences: PoolInput): String, 
    # Interview
    createInterview(interview: InterviewInput): String,
    confirmInterview(interview: InterviewInput): String,
    # Invitation
    createInvitation(email: String): String
  }
`

module.exports = {
  query
}
