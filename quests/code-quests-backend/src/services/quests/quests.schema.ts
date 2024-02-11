// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { StringEnum, Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { QuestService } from './quests.class'
import { logger } from '../../logger'
import { categorySchema } from '../categories/categories.schema'
import { orgSchema } from '../orgs/orgs.schema'
import { userSchema } from '../users/users.schema'

// Main data model schema
export const questSchema = Type.Object(
  {
    id: Type.Number(),
    title: Type.String(),
    status: StringEnum(['draft', 'published', 'archived']),
    type: StringEnum(['contest', 'race']),
    phase: StringEnum(['registration', 'submission', 'review', 'ended']),
    heroImg: Type.Optional(Type.String({ format: 'uri' })),
    icon: Type.Optional(Type.String({ format: 'uri' })),

    // Dates
    createdOn: Type.String({ format: 'date-time' }),
    publishedOn: Type.Optional(Type.String({ format: 'date-time' })),
    registrationDeadline: Type.String({ format: 'date-time' }),
    submissionDeadline: Type.String({ format: 'date-time' }),
    reviewDeadline: Type.String({ format: 'date-time' }),
    endedOn: Type.Optional(Type.String({ format: 'date-time' })),
    updatedOn: Type.Optional(Type.String({ format: 'date-time' })),
    archivedOn: Type.Optional(Type.String({ format: 'date-time' })),

    // Restrictions
    location: Type.Optional(Type.String()),
    maxParticipants: Type.Optional(Type.String()),
    minParticipants: Type.Optional(Type.String()),
    updates: Type.Optional(Type.Array(Type.String())),
    isPublic: Type.Boolean(),
    requiresApproval: Type.Boolean(),

    // Tasks
    description: Type.String(),
    tasks: Type.Optional(Type.Array(Type.String())),

    // Relations
    categoryId: Type.Number(),
    category: Type.Ref(categorySchema),

    orgId: Type.Number(),
    org: Type.Ref(orgSchema),
    
    managerId: Type.Number(),
    manager: Type.Ref(userSchema)

    // Not added yet
    // scoreboardId: Type.Number(),
    // scoreboard: Type.Ref(scoreboardSchema)
  },
  { $id: 'Quest', additionalProperties: false }
)
export type Quest = Static<typeof questSchema>
export const questValidator = getValidator(questSchema, dataValidator)
export const questResolver = resolve<Quest, HookContext<QuestService>>({
  // populate relations here
  manager: virtual(async (quest, context) => {
    return await context.app.service('users').get(quest.managerId)
  }),
  org: virtual(async (quest, context) => {
    return await context.app.service('orgs').get(quest.orgId)
  }),
  category: virtual(async (quest, context) => {
    return await context.app.service('categories').get(quest.categoryId)
  })
})

export const questExternalResolver = resolve<Quest, HookContext<QuestService>>({})

// Schema for creating new entries
export const questDataSchema = Type.Pick(questSchema, ['title', 'status', 'type', 'phase', 'heroImg', 'icon', 'registrationDeadline', 'submissionDeadline', 'reviewDeadline', 'location', 'maxParticipants', 'minParticipants', 'isPublic', 'requiresApproval', 'description', 'categoryId', 'orgId', 'tasks'], {
  $id: 'QuestData'
})
export type QuestData = Static<typeof questDataSchema>
export const questDataValidator = getValidator(questDataSchema, dataValidator)
export const questDataResolver = resolve<Quest, HookContext<QuestService>>({
  managerId: async (value, quest, context) => {
    if (context.params.user){
      return context.params.user.id
    }
    else {
      logger.error("the user creating a quest is undefined, can't set managerId")
      return undefined
    }
  },
  createdOn: async (value, quest, context) => new Date().toISOString(),
  publishedOn: async (value, quest, context) => {
    if (quest.isPublic === true) {
      logger.info("a quest is published")
      return new Date().toISOString()
    }
    else {
      return undefined
    }
  },
  endedOn: async (value, quest, context) => {
    if (quest.phase === 'ended') {
      logger.info("a quest is ended")
      return new Date().toISOString()
    }
    else {
      return undefined
    }
  },
  archivedOn: async (value, quest, context) => {
    if (quest.status === 'archived') {
      logger.info("a quest is archived")
      return new Date().toISOString()
    }
    else {
      return undefined
    }
  },
})

// Schema for updating existing entries
export const questPatchSchema = Type.Partial(questSchema, {
  $id: 'QuestPatch'
})
export type QuestPatch = Static<typeof questPatchSchema>
export const questPatchValidator = getValidator(questPatchSchema, dataValidator)
export const questPatchResolver = resolve<Quest, HookContext<QuestService>>({
  publishedOn: async (value, quest, context) => {
    if (quest.isPublic === true) {
      logger.info("a quest is published")
      return new Date().toISOString()
    }
    else {
      return undefined
    }
  },
  endedOn: async (value, quest, context) => {
    if (quest.phase === 'ended') {
      logger.info("a quest is ended")
      return new Date().toISOString()
    }
    else {
      return undefined
    }
  },
  archivedOn: async (value, quest, context) => {
    if (quest.status === 'archived') {
      logger.info("a quest is archived")
      return new Date().toISOString()
    }
    else {
      return undefined
    }
  },
  updatedOn: async (value, quest, context) => {
    logger.info("a quest is updated")
    return new Date().toISOString()
  }
})

// Schema for allowed query properties
export const questQueryProperties = Type.Pick(questSchema, ['id', 'title', 'status', 'type', 'phase', 'isPublic', 'managerId', 'orgId', 'categoryId'])
export const questQuerySchema = Type.Intersect(
  [
    querySyntax(questQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type QuestQuery = Static<typeof questQuerySchema>
export const questQueryValidator = getValidator(questQuerySchema, queryValidator)
export const questQueryResolver = resolve<QuestQuery, HookContext<QuestService>>({
  id: async (value, quest, context) => {
    // We want to be able to find all public and not drafted quests
    // But only let a user modify their own quests otherwise
    if (context.params.user?.role === 'admin' || context.params.user?.id === quest.managerId) {
      return value
    }
    else if ((context.method === 'find' || context.method === 'get') && quest.isPublic && quest.status !== 'draft') {
      return value
    }
    
    return undefined
  }
})
