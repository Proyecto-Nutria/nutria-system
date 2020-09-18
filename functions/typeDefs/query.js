const { gql } = require('apollo-server-express')

const query = gql`
  type Query {
    persons: [Person]
  }
  type Mutation{
    setMessage(message: String): String
  }
`

module.exports = {
  query
}
