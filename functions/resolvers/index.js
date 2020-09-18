const { personResolvers } = require('./personResolvers')
// const { companyInterviewResolvers } = require('./companyInterviewResolvers')

const resolvers = [personResolvers] //, companyInterviewResolvers]

module.exports = {
  resolvers // , companyInterviewResolvers
}
