const { SingletonAdmin } = require('../models')

const invitationResolvers = {
  Mutation: {
    createInvitation: (_, { email }) => {
      const invitationRef = SingletonAdmin.GetInstance().database().ref('invitations/')
      return invitationRef
        .orderByChild('email')
        .equalTo(email)
        .once('value')
        .then(snap => {
          if (snap.exists()) {
            if (snap.val().used === true) return 'No invitation needed '
            return 'Invitation set but user not registered yet'
          } else {
            invitationRef.push({
              email: email,
              used: false
            })
            return 'Inserted Into Database'
          }
        })
    }
  }
}

module.exports = {
  invitationResolvers
}
