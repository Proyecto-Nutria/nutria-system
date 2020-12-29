const {
  GoogleFactory,
  DRIVE_API,
  PDF_TYPE,
  FOLDER_TYPE
} = require('../models')
const {
  INTERVIEWEE_REF
} = require('./constants')
const {
  getDatabaseReferenceOf,
  forbiddenError
} = require('../utils')

const intervieweeResolvers = {
  Mutation: {
    /**
     * Creates a new entry in the interviewees' tree and its corresponding google drive
     * folder, the folder is used to put the resume of the interviewee and to store the
     * docs for the future interviews
     * @author interviewee
     * @param {object} IntervieweeInput
     * @example
     * mutation($file: Upload!){
     *   createInterviewee(
     *     interviewee: {
     *       resume: $file,
     *       school: IPN
     *     }
     *   )
     * }
     * @return {String}
     */
    createInterviewee: async (_parent, { interviewee }, context) => {
      const { stream } = await interviewee.resume

      const intervieweeUid = context.uid
      const driveAPI = new GoogleFactory(DRIVE_API)
      const intervieweeFolderId = await driveAPI.createResource(intervieweeUid, FOLDER_TYPE)
      await driveAPI.createResource('resume.pdf', PDF_TYPE, intervieweeFolderId, stream)
      const intervieweeRef = getDatabaseReferenceOf(intervieweeUid, INTERVIEWEE_REF)

      delete interviewee.resume
      interviewee.uid = intervieweeUid
      interviewee.folderuid = intervieweeFolderId

      intervieweeRef
        .child(intervieweeUid)
        .set(JSON.parse(JSON.stringify(interviewee)))
        .catch(e => { console.error(e); throw forbiddenError() })

      return 'Inserted Into Database'
    },
    /**
     * Updates the resume or the information of the interviewee
     * @author interviewee
     * @param {object} IntervieweeUpdateInput
     * @example
     * mutation( $file: Upload!){
     *  updateInterviewee(
     *    interviewee: {
     *      resume: $file
     *    }
     *  )
     * }
     * @return {String}
     */
    updateInterviewee: async (_parent, { interviewee }, context) => {
      const intervieweeUid = context.uid

      if (typeof (interviewee.resume) !== 'undefined') {
        const { stream } = await interviewee.resume
        const driveAPI = new GoogleFactory(DRIVE_API)
        const intervieweeFolderId = await driveAPI.getResourceId(FOLDER_TYPE, context.uid)
        const intervieweeResumeId = await driveAPI.getResourceId(PDF_TYPE, 'resume.pdf')
        await driveAPI.deleteResource(intervieweeResumeId)
        await driveAPI.createResource('resume.pdf', PDF_TYPE, intervieweeFolderId, stream)
        delete interviewee.resume
      }

      const interviewerRef = getDatabaseReferenceOf(intervieweeUid, INTERVIEWEE_REF)
      interviewerRef
        .child(intervieweeUid)
        .update(JSON.parse(JSON.stringify(interviewee)))
        .catch(e => { console.error(e); throw forbiddenError() })
      return 'Interviewee Updated'
    }
  }
}

module.exports = {
  intervieweeResolvers
}
