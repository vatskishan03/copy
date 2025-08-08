import winston from 'winston'
import path from 'path'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // File transports can be slow on ephemeral filesystems; keep them in prod only
    ...(process.env.NODE_ENV === 'production'
      ? [
          new winston.transports.File({
            filename: path.join(__dirname, '../../logs/error.log'),
            level: 'error',
            maxsize: 5 * 1024 * 1024,
            maxFiles: 5,
          }),
          new winston.transports.File({
            filename: path.join(__dirname, '../../logs/combined.log'),
            maxsize: 5 * 1024 * 1024,
            maxFiles: 5,
          }),
        ]
      : []),
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }))
}

export { logger }