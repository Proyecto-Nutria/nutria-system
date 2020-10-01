const fs = require('fs')
const path = require('path')

const { SingletonAdmin } = require('../models')
const sgMail = require('@sendgrid/mail')
const sendgridCredentials = require('../config/sendgrid-credentials.json')
const {
  INTERVIEW_REF
} = require('./constants')

const interviewResolvers = {
  Mutation: {
    createInterview: (_, { interview }) => {
      const openFile = (filePath) => fs.readFileSync(path.resolve(__dirname, filePath), 'utf8')
      const header = openFile('../template/header.html')
      const content = openFile('../template/content.html').replace('[[username]]', 'Nutria Name')
      const footer = openFile('../template/footer.html')

      sgMail.setApiKey(sendgridCredentials.api_key)
      const msg = {
        to: 'reyesfragosoroberto@gmail.com',
        from: 'proyecto.nutria.escom@gmail.com',
        subject: 'Interview Remainder', // TODO: Add day of the interview
        html: header.concat(content, footer)
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })

      /* const userRef = SingletonAdmin.GetInstance().database().ref(INTERVIEW_REF)
      userRef.push(JSON.parse(JSON.stringify(interview))) */
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
