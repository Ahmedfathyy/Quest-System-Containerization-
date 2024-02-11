// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { OrgService } from './orgs.class'
import { User, userSchema } from '../users/users.schema'
import { logger } from '../../logger'

// Main data model schema
export const orgSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    description: Type.Optional(Type.String()),
    
    logo: Type.Optional(Type.String({ format: 'uri' })),
    phone: Type.Optional(Type.String()),
    website: Type.Optional(Type.String({ format: 'uri' })),
    
    isVerified: Type.Optional(Type.Boolean()),
    isActive: Type.Optional(Type.Boolean()),
    isPublic: Type.Boolean(),
    
    // Relations
    managerId: Type.Number(),
    manager: Type.Ref(userSchema)
  },
  { $id: 'Org', additionalProperties: false }
)
export type Org = Static<typeof orgSchema>
export const orgValidator = getValidator(orgSchema, dataValidator)
export const orgResolver = resolve<Org, HookContext<OrgService>>({
  // populate relations here
  manager: virtual(async (org, context) => {
    return await context.app.service('users').get(org.managerId)
  })
})

export const orgExternalResolver = resolve<Org, HookContext<OrgService>>({})

// Schema for creating new entries
export const orgDataSchema = Type.Pick(orgSchema, ['name', 'description', 'logo', 'phone', 'website', 'isPublic'], {
  $id: 'OrgData'
})
export type OrgData = Static<typeof orgDataSchema>
export const orgDataValidator = getValidator(orgDataSchema, dataValidator)
export const orgDataResolver = resolve<Org, HookContext<OrgService>>({
  managerId: async (value, org, context) => {
    if (context.params.user){
      return context.params.user.id
    }
    else {
      logger.error("the user creating an org is undefined, can't set managerId")
      return undefined
    }
  },
  isActive: async (value, org, context) => {
    // admins can create non-active orgs
    if (context.params.user && context.params.user.role === 'admin') {
      if (value == false) {
        logger.info("an admin created a non-active org")
      }
      
      return value || true
    }

    // an org is active by default
    return true
  },
  isVerified: async (value, org, context) => {
    // admins can create verified/non-verified orgs
    if (context.params.user && context.params.user.role === 'admin') {
      if (value == true) {
        logger.info("an admin created a verified org")
      }

      return value || true
    }

    // an org is not verified until an admin verifies it
    return false
  }
})

// Schema for updating existing entries
export const orgPatchSchema = Type.Partial(orgSchema, {
  $id: 'OrgPatch'
})
export type OrgPatch = Static<typeof orgPatchSchema>
export const orgPatchValidator = getValidator(orgPatchSchema, dataValidator)
export const orgPatchResolver = resolve<Org, HookContext<OrgService>>({
  isActive: async (value, org, context) => {
    // only admins are allowed to block/unblock orgs
    if (context.params.user && context.params.user.role === 'admin') {
      if (org.isActive && value == false) {
        logger.info("an admin blocked an org")
      }
      else if (!org.isActive && value == true) {
        logger.info("an admin unblocked an org")
      }
      
      return value
    }
    else if (context.params.user) {
      logger.warn("a non-admin user is trying to block an org")
    }
    else {
      logger.error("an undefined user is trying to block/unblock an org")
    }
  },
  isVerified: async (value, org, context) => {
    // only admins are allowed to verify/unverify orgs
    if (context.params.user && context.params.user.role === 'admin') {
      if (org.isVerified && value == false) {
        logger.info("an admin unverified an org")
      }
      else if (!org.isVerified && value == true) {
        logger.info("an admin verified an org")
      }
      
      return value
    }
    else if (context.params.user) {
      logger.warn("a non-admin user is trying to verify/unverify an org")
    }
    else {
      logger.error("an undefined user is trying to verify/unverify an org")
    }
  }
})

// Schema for allowed query properties
export const orgQueryProperties = Type.Pick(orgSchema, ['id', 'name', 'managerId', 'isVerified', 'isActive', 'isPublic'])
export const orgQuerySchema = Type.Intersect(
  [
    querySyntax(orgQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type OrgQuery = Static<typeof orgQuerySchema>
export const orgQueryValidator = getValidator(orgQuerySchema, queryValidator)
export const orgQueryResolver = resolve<OrgQuery, HookContext<OrgService>>({
  id: async (value, org, context) => {
    // We want to be able to get/find all public orgs but
    // only let a user modify their own orgs otherwise
    if (context.params.user?.role === 'admin' || context.params.user?.id === org.managerId) {
      return value
    }
    else if ((context.method === 'find' || context.method === 'get') && org.isPublic) {
      return value
    }

    return undefined
  }
})
