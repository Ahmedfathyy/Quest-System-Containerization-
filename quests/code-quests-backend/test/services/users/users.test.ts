// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
// Note: using '_' before service methods disable hooks/resolvers
import { assert } from 'chai'
import { app } from '../../../src/app'
import { User, UserData } from '../../../src/services/users/users.shared'
import * as testUtilities from '../../testUtilities'


describe('users service', () => {
  beforeEach(async function () {
    // runs before each test in this block
    
    // reset the testing database
    await app.service('users').remove(null)
  })

  afterEach(async function () {
    // runs after each test in this block

    // reset the testing database
    await app.service('users').remove(null)
  })
  
  it('registered the service', () => {
    const service = app.service('users')

    assert.isOk(service, 'Registered the service')
  })
  
  it('should not register users with admin role', async () => {
    try {
      const adminUser = await app.service('users').create(testUtilities.adminUser1Data)
      assert.fail()
    } catch (error: any) {
      assert.strictEqual(error.code, 400)
    }
  })

  it('creates users and lets them access their data only', async () => {
    const contestantUser1 = await app.service('users').create(testUtilities.contestantUser1Data)
    const contestantUser2 = await app.service('users').create(testUtilities.contestantUser2Data)
    const clientUser1 = await app.service('users').create(testUtilities.clientUser1Data)
    const clientUser2 = await app.service('users').create(testUtilities.clientUser2Data)
    
    assert.isOk(contestantUser1)
    assert.isOk(contestantUser2)
    assert.isOk(clientUser1)
    assert.isOk(clientUser2)

    // user can access his data
    const params = { user: contestantUser1 }  // fake authentication
    const retrievedUser = await app.service('users').get(contestantUser1.id, params)
    assert.isOk(retrievedUser)
    assert.strictEqual(retrievedUser.id, contestantUser1.id)
    
    // trying different combinations of accessing other user's data
    testUtilities.accessOtherUserData(contestantUser1, contestantUser2)
    testUtilities.accessOtherUserData(contestantUser1, clientUser1)
    testUtilities.accessOtherUserData(clientUser1, contestantUser1)
    testUtilities.accessOtherUserData(clientUser1, clientUser2)
  })

  it('should not let users change/update certain attributes', async () => {
    const contestantUser1 = await app.service('users').create(testUtilities.contestantUser1Data)
    const params = { user: contestantUser1 }  // fake authentication
    const updatedUser1 = await app.service('users').patch(contestantUser1.id, {
      handle: 'niceHandle',
      password: 'newSecretPassword',
      role: 'admin',
      isActive: false,
      lastLoginIP: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      lastLoginOn: '2000-10-31T01:30:00.000-05:00'
    }, params)

    assert.isNotOk(updatedUser1.role === 'admin')
    assert.isNotOk(updatedUser1.password === 'newSecretPassword', 'password should be hashed')
    assert.isNotOk(updatedUser1.lastLoginIP === '2001:0db8:85a3:0000:0000:8a2e:0370:7334')
    assert.isNotOk(updatedUser1.lastLoginOn === '2000-10-31T01:30:00.000-05:00')
    assert.isNotOk(updatedUser1.isActive == false)
    assert.isOk(updatedUser1.handle === 'niceHandle', 'user can change handle normally')
  })

  it('lets admins manage everything', async () => {
    // some required attributes like 'isActive' are populated by hooks/resolvers
    // using '_' before service methods disable hooks and resolvers
    // to create an admin, a normal user is created using hooks/resolvers to populate required data
    // and then updated with _patch to be an admin without the hooks/resolvers rejecting it
    const normalUser = await app.service('users').create(testUtilities.clientUser2Data)
    const adminUser = await app.service('users')._patch(normalUser.id, { role: 'admin' })
    const params1 = { user: adminUser }  // fake authentication

    const contestantUser1 = await app.service('users').create(testUtilities.contestantUser1Data)
    const clientUser1 = await app.service('users').create(testUtilities.clientUser1Data)
    
    const blockedUser = await app.service('users').patch(clientUser1.id, { isActive: false }, params1)
    assert.strictEqual(blockedUser.isActive, false)

    await app.service('users').remove(contestantUser1.id, params1)  // delete a user
    try {
      const deletedUser = await app.service('users')._get(contestantUser1.id)
      assert.fail()
    } catch (error: any) {
      assert.strictEqual(error.code, 404)
    }
  })
})
