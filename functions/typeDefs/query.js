const { gql } = require('apollo-server-express')

const query = gql`
  type Query {
    persons: [Person]
  }
`

module.exports = {
  query
}
