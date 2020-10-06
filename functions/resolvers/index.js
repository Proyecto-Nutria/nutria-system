const { userResolvers } = require('./userResolvers')
const { interviewResolvers } = require('./interviewResolvers')
const { invitationResolvers } = require('./invitationResolvers')
const { intervieweeResolver } = require('./intervieweeResolver')

// TODO: Create the index on Firebase page
const resolvers = [
  userResolvers,
  interviewResolvers,
  invitationResolvers,
  intervieweeResolver
]

module.exports = {
  resolvers
}
