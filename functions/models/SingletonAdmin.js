var SingletonAdmin = (function () {
  var instance

  function CreateInstance () {
    const firebaseAdmin = require('firebase-admin')
    const serviceAccount = require('../config/nutria-system-firebase-adminsdk-pxglq-fd1c8e1cfd.json')
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
      databaseURL: 'https://nutria-system.firebaseio.com'
    })
    return firebaseAdmin
  }

  return {
    GetInstance: function () {
      if (!instance) {
        instance = CreateInstance()
      }
      return instance
    }
  }
})()

module.exports = {
  SingletonAdmin
}
