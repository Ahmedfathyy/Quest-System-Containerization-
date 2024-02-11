// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Quest, QuestData, QuestPatch, QuestQuery } from './quests.schema'

export type { Quest, QuestData, QuestPatch, QuestQuery }

export interface QuestParams extends KnexAdapterParams<QuestQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class QuestService<ServiceParams extends Params = QuestParams> extends KnexService<
  Quest,
  QuestData,
  QuestParams,
  QuestPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'quests',
    multi: true
  }
}
