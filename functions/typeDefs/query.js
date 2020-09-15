const { gql } = require('apollo-server-express')

const query = gql`
  type Query {
    interviewee: [Interviewee]
  }
`

module.exports = {
  query
}
