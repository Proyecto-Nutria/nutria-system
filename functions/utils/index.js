const { getDatabaseReferenceOf } = require('./references')
const { authenticationError, forbiddenError } = require('./errors')

module.exports = {
  getDatabaseReferenceOf,
  authenticationError,
  forbiddenError
}
