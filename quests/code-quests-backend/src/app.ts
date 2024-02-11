// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import express, {
  rest,
  json,
  urlencoded,
  cors,
  serveStatic,
  notFound,
  errorHandler
} from '@feathersjs/express'

import dotenv from 'dotenv'
import path from 'path'

// Determine the environment (e.g., 'development', 'test', 'production')
const environment = process.env.NODE_ENV || 'development';

// Load environment variables based on the environment
const envFilePath = path.resolve('./', `.env.${environment}`);
dotenv.config({ path: envFilePath });


import configuration from '@feathersjs/configuration'
import socketio from '@feathersjs/socketio'
import swagger from 'feathers-swagger'

import type { Application } from './declarations'
import { configurationValidator } from './configuration'
import { logger } from './logger'
import { logError } from './hooks/log-error'
import { postgresql } from './postgresql'
import { authentication } from './authentication'
import { services } from './services/index'
import { channels } from './channels'

const app: Application = express(feathers())

// Load app configuration
app.configure(configuration(configurationValidator))
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))

// Host the public folder
app.use('/', serveStatic(app.get('public')))

// Configure Swagger
app.configure(swagger({
  docsPath: '/docs',
  specs: {
    info: {
      title: 'Code Quests APIs',
      description: 'API docs using swagger',
      version: '1.0.0',
    },
    schemes: ['http', 'https'] // Optionally set the protocol schema used (sometimes required when host on https)
  },
  ui: swagger.swaggerUI({}),
  
}))

// Configure services and real-time functionality
app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: app.get('origins')
    }
  })
)
app.configure(postgresql)
app.configure(authentication)
app.configure(services)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(notFound())
app.use(errorHandler({ logger }))

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }
