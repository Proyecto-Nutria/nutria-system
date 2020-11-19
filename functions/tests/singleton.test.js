describe('Firebase Singleton ', () => {
  test('It should create a unique instance of firebase', () => {
    const { SingletonAdmin } = require('../models')
    var firstSingleInstance = {}
    var secondSingleInstance = {}
    firstSingleInstance = SingletonAdmin.GetInstance(null)
    secondSingleInstance = SingletonAdmin.GetInstance(null)
    expect(firstSingleInstance === secondSingleInstance).toEqual(true)
  })
})
