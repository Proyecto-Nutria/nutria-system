const { gql } = require('apollo-server-express')

const query = gql`
  type Query {
    # User
    getUserType: [String],
    # Interviews
    getIncomingInterviews: [sInterview],
    # Interviewee
    getAllInterviewees: [User]
  }
  type Mutation{
    setMessage(message: String): String,
    # Interviewee
    createUserInterviewee(user: UserIntervieweeInput): String,
    # Interview
    createInterview(interview: InterviewInput): String,
    confirmInterview(interview: InterviewInput): String, #TODO: Change to a proper input
    # Invitation
    createInvitation(email: String): String
  }
`

module.exports = {
  query
}
