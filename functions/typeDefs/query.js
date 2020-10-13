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
    # Interviewer
    createInterviewer(interviewer: InterviewerInput): String,
    # Interviewee
    createInterviewee(interviewee: IntervieweeInput): String,
    enterToPool(preferences: PoolInput): String,
    # Interview
    createInterview(interview: InterviewInput): String,
    confirmInterview(confirmation: ConfirmationInput): String,
    cancelInterview(interviewUid: String!): String,
    # Invitation
    createInvitation(email: String!): String
  }
`

module.exports = {
  query
}
