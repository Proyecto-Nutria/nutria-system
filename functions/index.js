const functions = require('firebase-functions')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { typeDefs } = require('./typeDefs')
const { resolvers } = require('./resolvers')

const app = express()
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    authScope: req.headers.authorization
  })
})

server.applyMiddleware({ app, path: '/', cors: true })
exports.graphql = functions.https.onRequest(app)
