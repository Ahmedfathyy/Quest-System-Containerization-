// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import { assert } from 'chai'
import { app } from '../../../src/app'
import * as testUtilities from '../../testUtilities'


describe('orgs service', () => {
  beforeEach(async function () {
    // runs before each test in this block
    
    // reset the testing database
    await app.service('users').remove(null)
    await app.service('orgs').remove(null)
  })

  afterEach(async function () {
    // runs after each test in this block

    // reset the testing database
    await app.service('users').remove(null)
    await app.service('orgs').remove(null)
  })
  
  it('registered the service', () => {
    const service = app.service('orgs')

    assert.isOk(service, 'Registered the service')
  })

  it('lets only authenticated client users to create/update/delete orgs', async () => {
    // authenticated client user trying to make an org
    const clientUser1 = await app.service('users').create(testUtilities.clientUser1Data)
    const params1 = { user: clientUser1 }  // fake authentication
    const org1 = await app.service('orgs').create(testUtilities.org1Data, params1)
    assert.isOk(org1)

    // authenticated client user trying to update an org
    await app.service('orgs').patch(org1.id, { isPublic: false }, params1)
    assert.strictEqual(org1.isPublic, false)

    // authenticated client user trying to delete an org
    await app.service('orgs').remove(org1.id, params1)
    try {
      const deletedOrg = await app.service('orgs')._get(org1.id)
      assert.fail()
    } catch (error: any) {
      assert.strictEqual(error.code, 404)
    }

    // authenticated contestant user trying to make an org
    const contestantUser1 = await app.service('users').create(testUtilities.contestantUser1Data)
    const params2 = { user: contestantUser1 }  // fake authentication
    try {
      const org2 = await app.service('orgs').create(testUtilities.org2Data, params2)
      assert.fail()
    } catch (error: any) {
      assert.strictEqual(error.code, 400)
    }
    
    // unauthenticated user trying to make an org
    try {
      const org3 = await app.service('orgs').create(testUtilities.org3Data)
      assert.fail()
    } catch (error: any) {
      assert.strictEqual(error.code, 401)
    }
  })

  it('lets authenticated client users to update/delete their orgs only', async () => {
    const clientUser1 = await app.service('users').create(testUtilities.clientUser1Data)  
    const params1 = { user: clientUser1 }  // fake authentication
    const org1 = await app.service('orgs').create(testUtilities.org1Data, params1)

    const clientUser2 = await app.service('users').create(testUtilities.clientUser2Data)
    const params2 = { user: clientUser2 }  // fake authentication
    const org2 = await app.service('orgs').create(testUtilities.org2Data, params2)

    // user can't update orgs of other users
    await app.service('orgs').patch(org2.id, { isPublic: false }, params1)
    assert.strictEqual(org2.isPublic, true)

    // user can't delete orgs of other users
    try {
      await app.service('orgs').remove(org2.id, params1)
      assert.fail()
    } catch (error: any) {
      assert.strictEqual(error.code, 401)
    }
  })

  it('lets anyone get/find public orgs', async () => {
    const contestantUser1 = await app.service('users').create(testUtilities.contestantUser1Data)
    const params1 = { user: contestantUser1 }  // fake authentication

    const clientUser1 = await app.service('users').create(testUtilities.clientUser1Data)
    const params2 = { user: clientUser1 }  // fake authentication
    const org1 = await app.service('orgs').create(testUtilities.org1Data, params2)  // public org
    const org2 = await app.service('orgs').create(testUtilities.org3Data, params2)  // private org

    // user can get only public orgs
    const retrievedOrg1 = await app.service('orgs').get(org1.id, params1)
    assert.isOk(retrievedOrg1)

    try {
      const retrievedOrg2 = await app.service('orgs').get(org2.id, params1)
      assert.fail()
    } catch (error: any) {
      assert.strictEqual(error.code, 404)
    }    

    // user can find only public orgs
    const orgsList = await app.service('orgs').find()
    assert.strictEqual(orgsList.total, 1)
    assert.strictEqual(orgsList.data[0].isPublic, true)
  })

  it('lets admins manage everything', async () => {
    // some required attributes like 'isActive' are populated by hooks/resolvers
    // using '_' before service methods disable hooks and resolvers
    // to create an admin, a normal user is created using hooks/resolvers to populate required data
    // and then updated with _patch to be an admin without the hooks/resolvers rejecting it
    const normalUser = await app.service('users').create(testUtilities.contestantUser1Data)
    const adminUser = await app.service('users')._patch(normalUser.id, { role: 'admin' })
    const params1 = { user: adminUser }  // fake authentication

    const clientUser1 = await app.service('users').create(testUtilities.clientUser1Data)
    const params2 = { user: clientUser1 }  // fake authentication
    const org1 = await app.service('orgs').create(testUtilities.org1Data, params2)

    // admin can update all orgs
    const updatedOrg1 = await app.service('orgs').patch(org1.id, { isPublic: false }, params1)
    assert.strictEqual(updatedOrg1.isPublic, false)

    // admin can delete all orgs
    try {
      await app.service('orgs').remove(org1.id, params1)
      const deletedOrg = await app.service('orgs')._get(org1.id)
      assert.fail()
    } catch (error: any) {
      assert.strictEqual(error.code, 404)
    }
  })
})
