const { userResolvers } = require('./userResolvers')
const { interviewResolvers } = require('./interviewResolvers')
const { invitationResolvers } = require('./invitationResolvers')

// TODO: Create the index on Firebase page
const resolvers = [
  userResolvers,
  interviewResolvers,
  invitationResolvers
]

module.exports = {
  resolvers
}
