const { AuthenticationError, ForbiddenError } = require('apollo-server-express')

function authenticationError () {
  return new AuthenticationError('You must be logged in')
}

function forbiddenError () {
  return new ForbiddenError('Not enough permission to write/read')
}

module.exports = {
  authenticationError,
  forbiddenError
}
