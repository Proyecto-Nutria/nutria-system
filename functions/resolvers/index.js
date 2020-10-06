const { userResolvers } = require('./userResolvers')
const { interviewResolvers } = require('./interviewResolvers')
const { invitationResolvers } = require('./invitationResolvers')
const { intervieweeResolver } = require('./intervieweeResolver')
const { interviewerResolver } = require('./interviewerResolver')

// TODO: Create the index on Firebase page
const resolvers = [
  userResolvers,
  interviewResolvers,
  invitationResolvers,
  intervieweeResolver,
  interviewerResolver
]

module.exports = {
  resolvers
}
