import { quest } from './quests/quests'
import { org } from './orgs/orgs'
import { category } from './categories/categories'
import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(quest)
  app.configure(org)
  app.configure(category)
  app.configure(user)
  // All services will be registered here
}
