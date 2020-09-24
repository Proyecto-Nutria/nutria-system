const { gql } = require('apollo-server-express')

const query = gql`
  type Query {
    # User
    getUserType: [String],
    # Interviewee
    getAllInterviewees: [User]
  }
  type Mutation{
    setMessage(message: String): String,
    # Interviewee
    createUserInterviewee(user: UserIntervieweeInput): String,
    # Interview
    createInterview(interview: InterviewInput): String
  }
`

module.exports = {
  query
}
