// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import { assert } from 'chai'
import { app } from '../../../src/app'
import * as testUtilities from '../../testUtilities'


describe('categories service', () => {
  beforeEach(async function () {
    // runs before each test in this block
    
    // reset the testing database
    await app.service('users').remove(null)
    await app.service('categories').remove(null)
  })

  afterEach(async function () {
    // runs after each test in this block

    // reset the testing database
    await app.service('users').remove(null)
    await app.service('categories').remove(null)
  })
  
  it('registered the service', () => {
    const service = app.service('categories')

    assert.ok(service, 'Registered the service')
  })

  it('lets only admins manage categories', async () => {
    const contestantUser1 = await app.service('users').create(testUtilities.contestantUser1Data)
    const clientUser1 = await app.service('users').create(testUtilities.clientUser1Data)
    const normalUser1 = await app.service('users').create(testUtilities.contestantUser2Data)
    const adminUser1 = await app.service('users')._patch(normalUser1.id, { role: 'admin' })

    // unauthenticated users can't create categories
    try {
      const params = { provider: 'rest' }
      const category1 = await app.service('categories').create(testUtilities.category1Data, params)
      assert.fail()
    } catch (error: any) {
      assert.strictEqual(error.code, 401)
    }

    // contestant users can't create categories
    try {
      const params = { user: contestantUser1 }
      const category1 = await app.service('categories').create(testUtilities.category1Data, params)
      assert.fail()
    } catch (error: any) {
      assert.strictEqual(error.code, 401)
    }
    
    // client users can't create categories
    try {
      const params = { user: clientUser1 }
      const category1 = await app.service('categories').create(testUtilities.category1Data, params)
      assert.fail()
    } catch (error: any) {
      assert.strictEqual(error.code, 401)
    }

    // admin users can create categories
    const params = { user: adminUser1 }
    const category1 = await app.service('categories').create(testUtilities.category1Data, params)
    assert.isOk(category1)
  })
})
