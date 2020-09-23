// const { SingletonAdmin } = require('../models')

const { SingletonAdmin } = require('../models')

const interviewResolvers = {
  Mutation: {
    createInterview: (_, { interview }) => {
      const userRef = SingletonAdmin.GetInstance().database().ref('interviews/')
      userRef.push(JSON.parse(JSON.stringify(interview)))
      return 'Inserted Into Database'
    }
  }
}

module.exports = {
  interviewResolvers
}
