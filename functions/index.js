const functions = require('firebase-functions')
const express = require('express')
const { ApolloServer, AuthenticationError } = require('apollo-server-express')
const { typeDefs } = require('./typeDefs')
const { resolvers } = require('./resolvers')
const { SingletonAdmin } = require('./models')
const { Readable } = require('stream')

const app = express()

// TODO: Check in the future is the native support for firebase is already in the library
// The code below is necessary to be able to upload a file using firebase,
// If you know that you'll just be dealing with small files, this isn't a serious concern.
// - https://github.com/jaydenseric/graphql-upload/issues/129#issuecomment-449169753
// - https://github.com/jaydenseric/graphql-upload/issues/164#issuecomment-542368384
app.use((req, res, next) => {
  if (req.rawBody) {
    const readable = new Readable()
    readable._read = () => {}
    readable.push(req.rawBody)
    readable.push(null)
    Object.assign(req, readable)
  }
  next()
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization

    var FirebaseAuthentication = function verifyIdToken () {
      return SingletonAdmin.GetInstance().auth().verifyIdToken(token)
        .then(token => { return token.uid })
        .catch(_ => { return false })
    }

    const uidFirebase = await FirebaseAuthentication()
    if (uidFirebase === false) throw new AuthenticationError('you must be logged in')
    return { uid: uidFirebase }
  }
})

server.applyMiddleware({
  app,
  path: '/',
  cors: true
})

exports.graphql = functions.https.onRequest(app)
