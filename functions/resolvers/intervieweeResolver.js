const {
  SingletonAdmin,
  GoogleFactory,
  DRIVE_API,
  PDF_TYPE,
  FOLDER_TYPE
} = require('../models')
const {
  INTERVIEWEE_REF
} = require('./constants')

const intervieweeResolver = {
  Mutation: {
    createInterviewee: async (_parent, { interviewee }, context) => {
      const { stream, filename, mimetype, encoding } = await interviewee.resume
      const driveAPI = new GoogleFactory(DRIVE_API)
      const intervieweeFolderId = await driveAPI.createResource('PersonFolder', FOLDER_TYPE)
      const intervieweeResumeId = await driveAPI.createResource('resume.pdf', PDF_TYPE, intervieweeFolderId, stream)
      console.log(intervieweeResumeId)

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
