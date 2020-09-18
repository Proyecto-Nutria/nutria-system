const { query } = require('./query')
const { personType, types } = require('./types')

const typeDefs = [query, personType, types]

module.exports = {
  typeDefs
}
