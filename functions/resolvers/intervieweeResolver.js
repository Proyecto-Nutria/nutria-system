const { SingletonAdmin } = require('../models')

const intervieweeResolver = {
  Query: {
    interviewee: () => {
      return new SingletonAdmin.GetInstance().database()
        .ref('interviewee')
        .once('value')
        .then(snap => snap.val())
        .then(val => Object.keys(val).map(key => val[key]))
    }
  }
}

module.exports = {
  intervieweeResolver
}
