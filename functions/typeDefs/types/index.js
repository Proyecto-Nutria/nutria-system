const { gql } = require('apollo-server-express')

const fs = require('fs')
const types = gql`${fs.readFileSync(__dirname.concat('/schema.graphql'), 'utf8')}`

/** Legacy */
const { personType } = require('./personType')
/** END Legacy */

module.exports = {
  personType,
  types
}
