// For more information about this file see https://dove.feathersjs.com/guides/cli/logging.html
import { createLogger, format, transports } from 'winston'


// log filter to filter and separate logs in each file
const filterLevel = format((info, opts) => {
  return info.level === opts.levelFilter ? info : false;
})

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
export const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(format.splat(), format.simple()),
  transports: [
    new transports.Console(),
    
    // all logs in a single file
    new transports.File({ "filename": "logs/combined.log" }),
    
    // every log level is printed in a separate file
    new transports.File({
      "filename": "logs/error.log",
      "level": "error",
      "format": format.combine(format.errors({ stack: true }), format.splat(), format.json(), format.timestamp(), filterLevel({ levelFilter: 'error' }))
    }),
    new transports.File({
      "filename": "logs/warn.log",
      "level": "warn",
      "format": format.combine(format.splat(), format.json(), format.timestamp(), filterLevel({ levelFilter: 'warn' }))
    }),
    new transports.File({
      "filename": "logs/info.log",
      "level": "info",
      "format": format.combine(format.splat(), format.json(), format.timestamp(), filterLevel({ levelFilter: 'info' }))
    })
  ]
})
