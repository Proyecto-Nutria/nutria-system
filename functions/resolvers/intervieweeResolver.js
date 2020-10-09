const {
  SingletonAdmin,
  GoogleFactory,
  DRIVE_API,
  PDF_TYPE,
  FOLDER_TYPE
} = require('../models')
const {
  INTERVIEWEE_REF,
  POOL_REF
} = require('./constants')

const intervieweeResolver = {
  Mutation: {
    createInterviewee: async (_parent, { interviewee }, context) => {
      const { stream, _filename, _mimetype, _encoding } = await interviewee.resume
      const intervieweeUid = context.uid
      const driveAPI = new GoogleFactory(DRIVE_API)
      const intervieweeFolderId = await driveAPI.createResource(intervieweeUid, FOLDER_TYPE)
      await driveAPI.createResource('resume.pdf', PDF_TYPE, intervieweeFolderId, stream)
      const intervieweeRef = SingletonAdmin.GetInstance().database().ref(INTERVIEWEE_REF)

      interviewee.uid = intervieweeUid
      interviewee.folderuid = intervieweeFolderId
      // Set will overwrite the data at the specified location
      intervieweeRef.child(intervieweeUid).set(JSON.parse(JSON.stringify(interviewee)))

      return 'Inserted Into Database'
    },
    enterToPool: (_parent, { preferences }, context) => {
      const poolRef = SingletonAdmin.GetInstance().database().ref(POOL_REF)
      preferences.uid = context.uid
      preferences.priority = 10
      const intervals = preferences.interval
      preferences.all = []
      for (var interval of intervals) {
        const intervalDay = interval.day
        preferences.all[intervalDay] = interval.interval
      }
      delete preferences.interval
      // console.log(preferences.interval)
      // poolRef.push(JSON.parse(JSON.stringify(preferences)))

      return 'Person inserted into the pool'
    }
  }
}

module.exports = {
  intervieweeResolver
}
