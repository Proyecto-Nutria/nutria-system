const { gql } = require('apollo-server-express')

const query = gql`
  type Query {
    # User
    getUserType: [String],
    # Pool
    viewPool: [Pool],
    # Interviews
    getIncomingInterviews: [Interview],
    # Interviewee
    getAllInterviewees: [User]
  }
  type Mutation{
    #Pool
    enterToPool(preferences: PoolInput): String,
    # Interviewee
    createInterviewee(interviewee: IntervieweeInput): String,
    updateInterviewee(interviewee: IntervieweeUpdateInput): String,
    # Interviewer
    createInterviewer(interviewer: InterviewerInput): String,
    updateInterviewer(interviewer: InterviewerInput): String,
    # Interview
    createInterview(interview: InterviewInput): String,
    confirmInterview(confirmation: ConfirmationInput): String,
    cancelInterview(cancellation: CancellationInput): String,
    # Invitation
    createInvitation(email: String!): String
  }
`

module.exports = {
  query
}
