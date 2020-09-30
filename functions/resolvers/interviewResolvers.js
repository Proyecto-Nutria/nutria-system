const { SingletonAdmin } = require('../models')
const sgMail = require('@sendgrid/mail')
const sendgridCredentials = require('../config/sendgrid-credentials.json')

const interviewResolvers = {
  Mutation: {
    createInterview: (_, { interview }) => {
      // TODO: Create email template
      sgMail.setApiKey(sendgridCredentials.api_key)
      const msg = {
        to: 'reyesfragosoroberto@gmail.com',
        from: 'proyecto.nutria.escom@gmail.com',
        subject: 'Nutrimail',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>'
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })

      const userRef = SingletonAdmin.GetInstance().database().ref('interviews/')
      userRef.push(JSON.parse(JSON.stringify(interview)))
      return 'Inserted Into Database'
    }
    /*
    confirmInterview: (_, { interview }) => {
      const interviewRef = SingletonAdmin.GetInstance().database().ref('interviews/' + interview.id)
      interviewRef.update({ status: 'confirmed' })
      // TODO: - Integrate google docs API
      // - Create google calendar event
      // - Select a room
      userRef.push(JSON.parse(JSON.stringify(interview)))
      return 'Inserted Into Database'
    } */
  }
}

module.exports = {
  interviewResolvers
}
