const { gql } = require('apollo-server-express')

const personType = gql`
    type Person{
        name: String
    }
`
module.exports = {
  personType
}
