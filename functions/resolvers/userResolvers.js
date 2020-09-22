// const { SingletonAdmin } = require('../models')

const userResolvers = {
  Mutation: {
    createUser: async (_, { user }) => {
      console.log(user)
      return 'Inserted into database'
    }
  }
}

module.exports = {
  userResolvers
}
