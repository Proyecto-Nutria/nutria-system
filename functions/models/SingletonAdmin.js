var SingletonAdmin = (function () {
  var adminInstance
  var userInstance

  function CreateInstance (userUid) {
    const firebaseAdmin = require('firebase-admin')
    const serviceAccount = require('../config/firebase-credentials.json')

    const firebaseConfiguration = {
      credential: firebaseAdmin.credential.cert(serviceAccount),
      databaseURL: 'https://nutria-system.firebaseio.com'
    }

    if (userUid !== null) {
      firebaseConfiguration.databaseAuthVariableOverride = {
        uid: userUid
      }
      const userAdmin = firebaseAdmin.initializeApp(firebaseConfiguration, 'user')
      return userAdmin
    } else {
      firebaseAdmin.initializeApp(firebaseConfiguration)
      return firebaseAdmin
    }
  }

  return {
    GetInstance: function (userUid) {
      if (userUid === null) {
        if (!adminInstance) {
          adminInstance = CreateInstance(userUid)
        }
        return adminInstance
      } else {
        if (!userInstance) {
          userInstance = CreateInstance(userUid)
        }
        return userInstance
      }
    }
  }
})()

module.exports = {
  SingletonAdmin
}
