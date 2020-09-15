const { query } = require('./query')
const { types } = require('./types')

const typeDefs = [query, types]

module.exports = {
  typeDefs
}
