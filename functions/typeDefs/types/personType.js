const { gql } = require('apollo-server-express')

const personType = gql`
    scalar Date
    enum ProgrammingLanguage{
      CPP
      PYTHON
      JAVA
      JAVASCRIPT
      GO
      RUST
    }
    enum School{
      IPN
      UNAM
    }
    enum Company{
      Microsoft
      Google
      Facebook
    }
    enum CompanyRole{
      Intern
      Explore
      STEP
      FTE
    }
    enum Role{
      Root
      Interviewee
      Interviewer
    }
    type User{
      uid: String!
      email: String!
      username: String!
      role: Role
    }

    type Interviewee{
      programmingLanguage: ProgrammingLanguage
      school: School
      resumeLink: String
      roleApplyingTo: CompanyRole
      companiesApplyingTo: [Company]
      typesOfInterview: [String]
      availability: [Dates]
      maxInterviewsPerWeek: Int
      upcomingRealInterviews: [RealInterview]
    }
    type Interviewer{
      isMentioned: Boolean 
      description: String
    }
    type Interview{
      interviewee: Interviewee!
      interviewer: Interviewer!
      date: Date!
      gDocUrl: String
      discordRoom: String
      confirmedByInterviewee: Boolean 
    }
    type RealInterview{
      company: Company!
      date: Date!
    }
    

`
module.exports = {
  personType
}
