import { assert } from 'chai'
import { CategoryData, OrgData, QuestData, User, UserData } from '../src/client'
import { app } from '../src/app'


// dummy data to be used in testing

export const contestantUser1Data: UserData = {
    email: 'contestant1@domain.com',
    password: 'contestant1password',
    handle: 'contestant1',
    role: 'contestant',
    country: 'Egypt',
    city: 'cairo',
    avatar: 'http://example.org'  
}
  
export const contestantUser2Data: UserData = {
    email: 'contestant2@domain.com',
    password: 'contestant2password',
    handle: 'contestant2',
    role: 'contestant',
    country: 'Egypt',
    city: 'giza',
    avatar: 'http://example.org'
}

export const clientUser1Data: UserData = {
    email: 'client1@domain.com',
    password: 'client1password',
    handle: 'client1',
    role: 'client',
    country: 'Egypt',
    city: 'cairo',
    avatar: 'http://example.org'  
}

export const clientUser2Data: UserData = {
    email: 'client2@domain.com',
    password: 'client2password',
    handle: 'client2',
    role: 'client',
    country: 'Egypt',
    city: 'alex',
    avatar: 'http://example.org'  
}

export const adminUser1Data: UserData = {
    email: 'admin1@domain.com',
    password: 'admin1password',
    handle: 'admin1',
    role: 'admin',
    country: 'Egypt',
    city: 'cairo',
    avatar: 'http://example.org'
}

export const category1Data: CategoryData = {
    name: 'backend',
    description: 'backend',
    icon: 'http://example.org',
    coverImg: 'http://example.org'
}

export const org1Data: OrgData = {
    name: 'org 1',
    description: 'org 1',
    logo: 'http://example.org',
    phone: '0123456789',
    website: 'http://example.org',
    isPublic: true
}
  
export const org2Data: OrgData = {
    name: 'org 2',
    description: 'org 2',
    logo: 'http://example.org',
    phone: '0123456789',
    website: 'http://example.org',
    isPublic: true
}
  
export const org3Data: OrgData = {
    name: 'org 3',
    description: 'org 3',
    logo: 'http://example.org',
    phone: '0123456789',
    website: 'http://example.org',
    isPublic: false
}

// categoryId & orgId will be given in the test
export const quest1Data: QuestData = {
    title: 'title 1',
    status: 'published',
    type: 'contest',
    phase: 'registration',
    registrationDeadline: '2000-10-31T01:30:00.000-05:00',
    submissionDeadline: '2000-10-31T01:30:00.000-05:00',
    reviewDeadline: '2000-10-31T01:30:00.000-05:00',
    isPublic: true,
    requiresApproval: true,
    description: 'description 1',
    categoryId: 1,
    orgId: 1
}
  
export const quest2Data: QuestData = {
    title: 'title 2',
    status: 'published',
    type: 'contest',
    phase: 'registration',
    registrationDeadline: '2000-10-31T01:30:00.000-05:00',
    submissionDeadline: '2000-10-31T01:30:00.000-05:00',
    reviewDeadline: '2000-10-31T01:30:00.000-05:00',
    isPublic: true,
    requiresApproval: true,
    description: 'description 2',
    categoryId: 2,
    orgId: 2
}
  
export const draftedQuestData: QuestData = {
    title: 'title 3',
    status: 'draft',
    type: 'contest',
    phase: 'registration',
    registrationDeadline: '2000-10-31T01:30:00.000-05:00',
    submissionDeadline: '2000-10-31T01:30:00.000-05:00',
    reviewDeadline: '2000-10-31T01:30:00.000-05:00',
    isPublic: true,
    requiresApproval: true,
    description: 'description 3',
    categoryId: 3,
    orgId: 3
}
  
export const privateQuestData: QuestData = {
    title: 'title 4',
    status: 'published',
    type: 'contest',
    phase: 'registration',
    registrationDeadline: '2000-10-31T01:30:00.000-05:00',
    submissionDeadline: '2000-10-31T01:30:00.000-05:00',
    reviewDeadline: '2000-10-31T01:30:00.000-05:00',
    isPublic: false,
    requiresApproval: true,
    description: 'description 3',
    categoryId: 3,
    orgId: 3
}

export const accessOtherUserData = async (user1: User, user2: User) => {
    const params = { user: user1 }  // fake authentication
    try {
        const retrievedUser = await app.service('users').get(user2.id, params)
        assert.fail()
    } catch (error: any) {
        assert.strictEqual(error.code, 404)
    }
}
