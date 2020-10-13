const fs = require('fs')
const path = require('path')

const CONFIRMATION_EMAIL = 'confirmation'
const CANCELLATION_EMAIL = 'cancellation'
const NUTRIA_EMAIL = 'proyecto.nutria.escom@gmail.com'
const sgMail = require('@sendgrid/mail')
const sendgridCredentials = require('../config/sendgrid-credentials.json')

const confirmationBody = require('../template/ConfirmationBody')
const emailGeneralTemplate = require('../template/GeneralTemplate')

class Email {
  constructor () {
    this._from = NUTRIA_EMAIL
    this._to = null
    this._subject = null
    this._html = null
  }

  sendEmail () {
    const message = {
      to: this._to,
      from: this._from,
      subject: this._subject,
      html: this._html
    }

    sgMail.setApiKey(sendgridCredentials.api_key)
    sgMail
      .send(message)
      .catch((error) => {
        console.error(error)
      })
  }
}

class ConfirmationEmail extends Email {
  sendEmailUsing (email, room, date, hour, docId) {
    this._to = email
    this._subject = `Nutria Interview at ${date}`
    const googleDocUrl = `docs.google.com/document/d/${docId}`
    const body = confirmationBody(room, date, hour, googleDocUrl)
    this._html = emailGeneralTemplate(body)
    super.sendEmail()
  }
}

class EmailFactory {
  constructor (type) {
    if (type === CONFIRMATION_EMAIL) { return new ConfirmationEmail() }
    // if (type === CANCELLATION_EMAIL) { return new DriveAPI() }
  }
}

module.exports = {
  EmailFactory,
  CONFIRMATION_EMAIL,
  CANCELLATION_EMAIL
}
