// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  orgDataValidator,
  orgPatchValidator,
  orgQueryValidator,
  orgResolver,
  orgExternalResolver,
  orgDataResolver,
  orgPatchResolver,
  orgQueryResolver
} from './orgs.schema'

import type { Application } from '../../declarations'
import { OrgService, getOptions } from './orgs.class'
import { orgPath, orgMethods } from './orgs.shared'

export * from './orgs.class'
export * from './orgs.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const org = (app: Application) => {
  // Register our service on the Feathers application
  app.use(orgPath, new OrgService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: orgMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(orgPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(orgExternalResolver),
        schemaHooks.resolveResult(orgResolver)
      ]
    },
    before: {
      // user should authenticate before creating, updating, or deleting an org
      all: [schemaHooks.validateQuery(orgQueryValidator), schemaHooks.resolveQuery(orgQueryResolver)],
      find: [],
      get: [],
      create: [authenticate('jwt'), schemaHooks.validateData(orgDataValidator), schemaHooks.resolveData(orgDataResolver)],
      patch: [authenticate('jwt'), schemaHooks.validateData(orgPatchValidator), schemaHooks.resolveData(orgPatchResolver)],
      remove: [authenticate('jwt')]
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [orgPath]: OrgService
  }
}
