// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Quest, QuestData, QuestPatch, QuestQuery, QuestService } from './quests.class'

export type { Quest, QuestData, QuestPatch, QuestQuery }

export type QuestClientService = Pick<QuestService<Params<QuestQuery>>, (typeof questMethods)[number]>

export const questPath = 'quests'

export const questMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const questClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(questPath, connection.service(questPath), {
    methods: questMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [questPath]: QuestClientService
  }
}
