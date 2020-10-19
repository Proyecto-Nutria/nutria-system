const { SingletonAdmin } = require('../models')
const {
  FIREBASE_VAL,
  INVITATION_REF,
  INVITATION_EMAIL_ATTR
} = require('./constants')

const invitationResolvers = {
  Mutation: {
    createInvitation: (_parent, { email }) => {
      const invitationRef = SingletonAdmin
        .GetInstance()
        .database()
        .ref(INVITATION_REF)

      return invitationRef
        .orderByChild(INVITATION_EMAIL_ATTR)
        .equalTo(email)
        .once(FIREBASE_VAL)
        .then(snap => {
          if (snap.exists()) {
            const invitation = snap.val()[Object.keys(snap.val())[0]]
            if (invitation.used === true) return 'No invitation needed '
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
