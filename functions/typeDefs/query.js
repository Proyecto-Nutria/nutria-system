const { gql } = require('apollo-server-express')

const query = gql`
  type Query {
    persons: [Person],
    users: [User],
    getUserType: [String]
  }
  type Mutation{
    setMessage(message: String): String,
    createUser(user: UserInput): String
  }
`

module.exports = {
  query
}
