// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import { assert } from 'chai'
import { app } from '../../../src/app'
import * as testUtilities from '../../testUtilities'


describe('quests service', () => {
  it('registered the service', () => {
    const service = app.service('quests')

    assert.isOk(service, 'Registered the service')
  })

  beforeEach(async function () {
    // runs before each test in this block
    
    // reset the testing database
    await app.service('users').remove(null)
    await app.service('orgs').remove(null)
    await app.service('quests').remove(null)
    await app.service('categories').remove(null)
  })

  afterEach(async function () {
    // runs after each test in this block

    // reset the testing database
    await app.service('users').remove(null)
    await app.service('orgs').remove(null)
    await app.service('quests').remove(null)
    await app.service('categories').remove(null)
  })

  it('lets only authenticated client users with registered orgs to create/update/delete quests', async () => {
    // some required attributes like 'isActive' are populated by hooks/resolvers
    // using '_' before service methods disable hooks and resolvers
    // to create an admin, a normal user is created using hooks/resolvers to populate required data
    // and then updated with _patch to be an admin without the hooks/resolvers rejecting it
    const normalUser = await app.service('users').create(testUtilities.contestantUser1Data)
    const adminUser = await app.service('users')._patch(normalUser.id, { role: 'admin' })
    const params1 = { user: adminUser }  // fake authentication

    // only admins can create categories to be used by quests
    const category1 = await app.service('categories').create(testUtilities.category1Data, params1)

    // authenticated client user trying to create a quest
    const clientUser1 = await app.service('users').create(testUtilities.clientUser1Data)
    const params2 = { user: clientUser1 }
    const org1 = await app.service('orgs').create(testUtilities.org1Data, params2)
    const quest1 = await app.service('quests').create({
      ...testUtilities.quest1Data,
      categoryId: category1.id,
      orgId: org1.id
    }, params2)
    assert.isOk(quest1)

    // authenticated client user trying to update a quest
    const updatedQuest = await app.service('quests').patch(quest1.id, { status: 'archived' }, params2)
    assert.strictEqual(updatedQuest.status, 'archived')

    // authenticated client user trying to delete a quest
    await app.service('quests').remove(quest1.id, params2)
    try {
      const deletedQuest = await app.service('quests')._get(quest1.id)
      assert.fail()
    } catch (error: any) {
      assert.strictEqual(error.code, 404)
    }

    // authenticated client user without an org trying to create a quest
    const clientUser2 = await app.service('users').create(testUtilities.clientUser2Data)
    const params3 = { user: clientUser2 }
    try {
      const quest2 = await app.service('quests').create({
        ...testUtilities.quest2Data,
        categoryId: category1.id,
        orgId: org1.id
      }, params3)
      assert.fail()
    } catch (error: any) {
      assert.strictEqual(error.code, 400)
    }
  })

  it('lets authenticated client users to update/delete their quests only', async () => {
    // some required attributes like 'isActive' are populated by hooks/resolvers
    // using '_' before service methods disable hooks and resolvers
    // to create an admin, a normal user is created using hooks/resolvers to populate required data
    // and then updated with _patch to be an admin without the hooks/resolvers rejecting it
    const normalUser = await app.service('users').create(testUtilities.contestantUser1Data)
    const adminUser = await app.service('users')._patch(normalUser.id, { role: 'admin' })
    const params1 = { user: adminUser }  // fake authentication

    // only admins can create categories to be used by quests
    const category1 = await app.service('categories').create(testUtilities.category1Data, params1)

    const clientUser1 = await app.service('users').create(testUtilities.clientUser1Data)
    const params2 = { user: clientUser1 }
    const org1 = await app.service('orgs').create(testUtilities.org1Data, params2)
    const quest1 = await app.service('quests').create({
      ...testUtilities.quest1Data,
      categoryId: category1.id,
      orgId: org1.id
    }, params2)

    const clientUser2 = await app.service('users').create(testUtilities.clientUser2Data)
    const params3 = { user: clientUser2 }

    // user can't update quests of other users
    const updatedQuest = await app.service('quests').patch(quest1.id, { status: 'archived' }, params3)
    assert.strictEqual(updatedQuest.status, 'published')

    // user can't delete quests of other users
    try {
      await app.service('quests').remove(quest1.id, params3)
      assert.fail()
    } catch (error: any) {
      assert.strictEqual(error.code, 401)
    }
  })

  it('lets anyone get/find public and not drafted quests', async () => {
    // some required attributes like 'isActive' are populated by hooks/resolvers
    // using '_' before service methods disable hooks and resolvers
    // to create an admin, a normal user is created using hooks/resolvers to populate required data
    // and then updated with _patch to be an admin without the hooks/resolvers rejecting it
    const normalUser = await app.service('users').create(testUtilities.clientUser2Data)
    const adminUser = await app.service('users')._patch(normalUser.id, { role: 'admin' })
    const params1 = { user: adminUser }  // fake authentication

    // only admins can create categories to be used by quests
    const category1 = await app.service('categories').create(testUtilities.category1Data, params1)

    const clientUser1 = await app.service('users').create(testUtilities.clientUser1Data)
    const params2 = { user: clientUser1 }  // fake authentication
    const org1 = await app.service('orgs').create(testUtilities.org1Data, params2)
    const publicNotDraftedQuest = await app.service('quests').create({
      ...testUtilities.quest1Data,
      categoryId: category1.id,
      orgId: org1.id
    }, params2)
    const privateQuest = await app.service('quests').create({
      ...testUtilities.privateQuestData,
      categoryId: category1.id,
      orgId: org1.id
    }, params2)
    const draftedQuest = await app.service('quests').create({
      ...testUtilities.draftedQuestData,
      categoryId: category1.id,
      orgId: org1.id
    }, params2)

    const contestantUser1 = await app.service('users').create(testUtilities.contestantUser1Data)
    const params3 = { user: contestantUser1 }

    // users can get public and not drafted quests
    const retrievedQuest1 = await app.service('quests').get(publicNotDraftedQuest.id, params3)
    assert.isOk(retrievedQuest1)

    // users can find only public and not drafted quests
    const retrievedQuestList = await app.service('quests').find(params3)
    assert.strictEqual(retrievedQuestList.total, 1)
    assert.strictEqual(retrievedQuestList.data[0].id, publicNotDraftedQuest.id)

    // users can't get private or drafted quests
    try {
      const retrievedQuest2 = await app.service('quests').get(privateQuest.id, params3)
      assert.fail()
    } catch (error: any) {
      assert.strictEqual(error.code, 404)
    }
    try {
      const retrievedQuest3 = await app.service('quests').get(draftedQuest.id, params3)
      assert.fail()
    } catch (error: any) {
      assert.strictEqual(error.code, 404)
    }
  })

  it('lets admins manage everything', async () => {
    // some required attributes like 'isActive' are populated by hooks/resolvers
    // using '_' before service methods disable hooks and resolvers
    // to create an admin, a normal user is created using hooks/resolvers to populate required data
    // and then updated with _patch to be an admin without the hooks/resolvers rejecting it
    const normalUser = await app.service('users').create(testUtilities.contestantUser1Data)
    const adminUser = await app.service('users')._patch(normalUser.id, { role: 'admin' })
    const params1 = { user: adminUser }  // fake authentication

    // only admins can create categories to be used by quests
    const category1 = await app.service('categories').create(testUtilities.category1Data, params1)

    const clientUser1 = await app.service('users').create(testUtilities.clientUser1Data)
    const params2 = { user: clientUser1 }  // fake authentication
    const org1 = await app.service('orgs').create(testUtilities.org1Data, params2)
    const quest1 = await app.service('quests').create({
      ...testUtilities.quest1Data,
      categoryId: category1.id,
      orgId: org1.id
    }, params2)

    // admins can update all quests
    const updatedQuest = await app.service('quests').patch(quest1.id, { isPublic: false }, params1)
    assert.strictEqual(updatedQuest.isPublic, false)

    // admins can delete all quests
    await app.service('quests').remove(quest1.id, params1)
    try {
      const deletedQuest = await app.service('quests')._get(quest1.id)
      assert.fail()
    } catch (error: any) {
      assert.strictEqual(error.code, 404)
    }
  })
})
