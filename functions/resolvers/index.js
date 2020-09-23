const { personResolvers } = require('./personResolvers')
const { userResolvers } = require('./userResolvers')
const { interviewResolvers } = require('./interviewResolvers')

const resolvers = [personResolvers, userResolvers, interviewResolvers]

module.exports = {
  resolvers // , companyInterviewResolvers
}
