const {
  SingletonAdmin
} = require('../models')

function getDatabaseReferenceOf (rootDatabase, uid) {
  return SingletonAdmin.GetInstance(uid).database().ref(rootDatabase)
}

module.exports = {
  getDatabaseReferenceOf
}
