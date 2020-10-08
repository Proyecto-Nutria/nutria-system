const {
  SingletonAdmin,
  GoogleFactory,
  DRIVE_API,
  PDF_TYPE
} = require('../models')
const {
  INTERVIEWEE_REF
} = require('./constants')

const intervieweeResolver = {
  Mutation: {
    createInterviewee: async (_parent, { interviewee }, context) => {
      const { stream, filename, mimetype, encoding } = await interviewee.resume
      const driveAPI = new GoogleFactory(DRIVE_API)
      driveAPI.uploadPDF('resume.pdf', PDF_TYPE, stream)

      /*
      const intervieweeUid = context.uid
      const intervieweeRef = SingletonAdmin.GetInstance().database().ref(INTERVIEWEE_REF)

      interviewee.uid = intervieweeUid
      // Set will overwrite the data at the specified location
      intervieweeRef.child(intervieweeUid).set(JSON.parse(JSON.stringify(interviewee))) */

      return 'Inserted Into Database'
    }
  }
}

module.exports = {
  intervieweeResolver
}
