const functions = require('firebase-functions')
const express = require('express')
const { ApolloServer, AuthenticationError } = require('apollo-server-express')
const { typeDefs } = require('./typeDefs')
const { resolvers } = require('./resolvers')
const { SingletonAdmin } = require('./models')

const app = express()
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization

    var FirebaseAuthentication = function verifyIdToken () {
      return SingletonAdmin.GetInstance().auth().verifyIdToken(token)
        .then(_ => { return true })
        .catch(_ => { return false })
    }

    if (await FirebaseAuthentication() === false) throw new AuthenticationError('you must be logged in')
  }
})

server.applyMiddleware({
  app,
  path: '/',
  cors: true
})

exports.graphql = functions.https.onRequest(app)
