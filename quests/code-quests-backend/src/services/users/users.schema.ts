// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, StringEnum, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { passwordHash } from '@feathersjs/authentication-local'
import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { UserService } from './users.class'
import { logger } from '../../logger'


// Main data model schema
export const userSchema = Type.Object(
  {
    // attribute uniqueness is handled in migrations

    id: Type.Number(),
    email: Type.String({ format: 'email' }),
    password: Type.String({ format: 'password' }),
    handle: Type.String(),

    role: StringEnum(['admin', 'client', 'contestant']),
    
    country: Type.Optional(Type.String()), // TODO: validate ISO format in resolvers
    city: Type.Optional(Type.String()),
    avatar: Type.Optional(Type.String({ format: 'uri' })),

    lastLoginOn: Type.Readonly(Type.String({ format: 'date-time' })), // TODO: automatically updated with hooks
    lastLoginIP: Type.Readonly(Type.String({ format: 'ipv6' })), // TODO: automatically updated with hooks
    isActive: Type.Optional(Type.Boolean({ 'default': true })) // automatically set to true in resolvers
  },
  { $id: 'User', additionalProperties: false },
)
export type User = Static<typeof userSchema>
export const userValidator = getValidator(userSchema, dataValidator)
export const userResolver = resolve<User, HookContext<UserService>>({})

export const userExternalResolver = resolve<User, HookContext<UserService>>({
  // The password should never be visible externally
  password: async () => undefined
})

// Schema for creating new entries
export const userDataSchema = Type.Pick(userSchema, ['email', 'password', 'handle', 'country', 'city', 'avatar', 'role', 'isActive'], {
  $id: 'UserData'
})
export type UserData = Static<typeof userDataSchema>
export const userDataValidator = getValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve<User, HookContext<UserService>>({
  password: passwordHash({ strategy: 'local' }),  // for storing hash of the password not the actual password
  role: async (value, user, context) => {
    // user can't claim to be an admin
    if (value === 'admin') {
      logger.warn("a user is trying to be an admin")
      return undefined
    }

    // user can choose between contestant and client
    return value
  },
  isActive: async (value, user, context) => {
    // admin can create non-active users
    if (context.params.user?.role === 'admin') {
      return value || true
    }

    // user is active by default
    return true
  }
})

// Schema for updating existing entries
export const userPatchSchema = Type.Partial(userSchema, {
  $id: 'UserPatch'
})
export type UserPatch = Static<typeof userPatchSchema>
export const userPatchValidator = getValidator(userPatchSchema, dataValidator)
export const userPatchResolver = resolve<User, HookContext<UserService>>({
  password: passwordHash({ strategy: 'local' }), // for storing hash of the password not the actual password
  role: async (value, user, context) => {
    // no switching roles allowed
    return undefined
  },
  isActive: async (value, user, context) => {
    // only admins can block/unblock users
    if (context.params.user?.role === 'admin') {
      if (user.isActive === true && value === false) {
        logger.info("a user is blocked by an admin")
      }
      else if (user.isActive === false && value === true) {
        logger.info("a user is unblocked by an admin")
      }
      
      return value
    }

    return undefined
  }
})

// Schema for allowed query properties
export const userQueryProperties = Type.Pick(userSchema, ['id', 'email', 'handle', 'country', 'city', 'isActive', 'role'])
export const userQuerySchema = Type.Intersect(
  [
    querySyntax(userQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type UserQuery = Static<typeof userQuerySchema>
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve<UserQuery, HookContext<UserService>>({
  // If there is a user (e.g. with authentication), they are only allowed to see their own data
  id: async (value, user, context) => {
    // Admins are allowed to see all data
    if (context.params.user?.role === 'admin') {
      return value
    }
    if (context.params.user?.id === user.id) {
      return value
    }

    return undefined
  }
})
