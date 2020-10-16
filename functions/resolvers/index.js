const { poolResolver } = require('./poolResolver')
const { userResolvers } = require('./userResolvers')
const { interviewResolvers } = require('./interviewResolvers')
const { invitationResolvers } = require('./invitationResolvers')
const { intervieweeResolver } = require('./intervieweeResolver')
const { interviewerResolver } = require('./interviewerResolver')

const resolvers = [
  poolResolver,
  userResolvers,
  interviewResolvers,
  invitationResolvers,
  intervieweeResolver,
  interviewerResolver
]

module.exports = {
  resolvers
}
