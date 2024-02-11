// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { questClient } from './services/quests/quests.shared'
export type { Quest, QuestData, QuestQuery, QuestPatch } from './services/quests/quests.shared'

import { orgClient } from './services/orgs/orgs.shared'
export type { Org, OrgData, OrgQuery, OrgPatch } from './services/orgs/orgs.shared'

import { categoryClient } from './services/categories/categories.shared'
export type {
  Category,
  CategoryData,
  CategoryQuery,
  CategoryPatch
} from './services/categories/categories.shared'

import { userClient } from './services/users/users.shared'
export type { User, UserData, UserQuery, UserPatch } from './services/users/users.shared'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the code-quests app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any,>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(userClient)
  client.configure(categoryClient)
  client.configure(orgClient)
  client.configure(questClient)
  return client
}
