const admin = require('firebase-admin')
const { SingletonAdmin } = require('./SingletonAdmin')

class FirebaseAdmin {
  static async getAuthInformationFrom (uid) {
    return await admin
      .auth()
      .getUser(uid)
      .then(userRecord => userRecord)
  }

  static async verifyToken (token) {
    return SingletonAdmin.GetInstance(null)
      .auth()
      .verifyIdToken(token)
      .then(token => { return token.uid })
      .catch(_ => { return false })
  }
}

module.exports = {
  FirebaseAdmin
}
