const { userResolvers } = require('./userResolvers')
const { interviewResolvers } = require('./interviewResolvers')
const { invitationResolvers } = require('./invitationResolvers')

const resolvers = [
  userResolvers,
  interviewResolvers,
  invitationResolvers
]

module.exports = {
  resolvers
}
