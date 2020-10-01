const { SingletonAdmin } = require('../models')
const { Constants } = require('./constants')

const invitationResolvers = {
  Mutation: {
    createInvitation: (_, { email }) => {
      const invitationRef = SingletonAdmin
        .GetInstance()
        .database()
        .ref(Constants.INVITATION_REF)

      return invitationRef
        .orderByChild(Constants.INVITATION_EMAIL_ATTR)
        .equalTo(email)
        .once('value')
        .then(snap => {
          if (snap.exists()) {
            if (snap.val().used === true) return 'No invitation needed '
            return 'Invitation set but user not registered yet'
          }
          invitationRef.push({
            email: email,
            used: false
          })
          return 'Inserted Into Database'
        })
    }
  }
}

module.exports = {
  invitationResolvers
}
