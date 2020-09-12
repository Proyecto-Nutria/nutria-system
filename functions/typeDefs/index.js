const { query } = require('./query')
const { personType } = require('./types')

const typeDefs = [query, personType]

module.exports = {
  typeDefs
}
