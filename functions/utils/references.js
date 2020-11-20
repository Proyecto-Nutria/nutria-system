const {
  SingletonAdmin
} = require('../models')

function getDatabaseReferenceOf (uid, rootDatabase) {
  return SingletonAdmin.GetInstance(uid).database().ref(rootDatabase)
}

module.exports = {
  getDatabaseReferenceOf
}
