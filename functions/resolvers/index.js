const { userResolvers } = require('./userResolvers')
const { interviewResolvers } = require('./interviewResolvers')

const resolvers = [userResolvers, interviewResolvers]

module.exports = {
  resolvers
}
