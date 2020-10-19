const { poolResolver } = require('./poolResolvers')
const { userResolvers } = require('./userResolvers')
const { interviewResolvers } = require('./interviewResolvers')
const { invitationResolvers } = require('./invitationResolvers')
const { intervieweeResolver } = require('./intervieweeResolvers')
const { interviewerResolver } = require('./interviewerResolvers')

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
