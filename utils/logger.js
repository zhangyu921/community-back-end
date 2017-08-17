const winston = require('winston')
const path = require('path')
require('winston-daily-rotate-file')

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.DailyRotateFile)({
      name: 'info-file',
      filename: path.join(__dirname, '..', 'logs', 'info.log'),
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
      level: process.env.ENV === 'production' ? 'info' : 'debug'
    }),
    new (winston.transports.DailyRotateFile)({
      name: 'error-file',
      filename: path.join(__dirname, '..', 'logs', 'error.log'),
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
      level: 'error'
    })
  ]
})

const requestLogger = new (winston.Logger)({
  transports: [
    new (winston.transports.DailyRotateFile)({
      name: 'info-file',
      filename: './logs/request.log',
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
      level: 'info'
    })
  ]
})

if (process.env.ENV !== 'production') {
  logger.add(winston.transports.Console)
  requestLogger.add(winston.transports.Console)
}

module.exports = {
  logger,
  requestLogger,
}