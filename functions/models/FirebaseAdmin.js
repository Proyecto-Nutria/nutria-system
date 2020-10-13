const admin = require('firebase-admin')

class FirebaseAdmin {
  static async getAuthInformationFrom (uid) {
    return await admin
      .auth()
      .getUser(uid)
      .then(userRecord => userRecord)
  }
}

module.exports = {
  FirebaseAdmin
}
