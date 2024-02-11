// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Org, OrgData, OrgPatch, OrgQuery } from './orgs.schema'

export type { Org, OrgData, OrgPatch, OrgQuery }

export interface OrgParams extends KnexAdapterParams<OrgQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class OrgService<ServiceParams extends Params = OrgParams> extends KnexService<
  Org,
  OrgData,
  OrgParams,
  OrgPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'orgs',
    multi: true
  }
}
