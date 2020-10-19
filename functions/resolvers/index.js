const { poolResolvers } = require('./poolResolvers')
const { userResolvers } = require('./userResolvers')
const { interviewResolvers } = require('./interviewResolvers')
const { invitationResolvers } = require('./invitationResolvers')
const { intervieweeResolvers } = require('./intervieweeResolvers')
const { interviewerResolvers } = require('./interviewerResolvers')

const resolvers = [
  poolResolvers,
  userResolvers,
  interviewResolvers,
  invitationResolvers,
  intervieweeResolvers,
  interviewerResolvers
]

module.exports = {
  resolvers
}
