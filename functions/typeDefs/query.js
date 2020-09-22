const { gql } = require('apollo-server-express')

const query = gql`
  type Query {
    persons: [Person],
    users: [User],
    getUserType: [String],
    getAllInterviewees: [User]
  }
  type Mutation{
    setMessage(message: String): String,
    createUserInterviewee(user: UserIntervieweeInput): String
  }
`

module.exports = {
  query
}
