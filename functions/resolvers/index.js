const { personResolvers } = require('./personResolvers')
const { userResolvers } = require('./userResolvers')

// const { companyInterviewResolvers } = require('./companyInterviewResolvers')

const resolvers = [personResolvers, userResolvers] //, companyInterviewResolvers]

module.exports = {
  resolvers // , companyInterviewResolvers
}
