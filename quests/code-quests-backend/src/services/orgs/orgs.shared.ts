// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Org, OrgData, OrgPatch, OrgQuery, OrgService } from './orgs.class'

export type { Org, OrgData, OrgPatch, OrgQuery }

export type OrgClientService = Pick<OrgService<Params<OrgQuery>>, (typeof orgMethods)[number]>

export const orgPath = 'orgs'

export const orgMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const orgClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(orgPath, connection.service(orgPath), {
    methods: orgMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [orgPath]: OrgClientService
  }
}
