import { createLogger, format, transports } from "winston"
import { env } from "~/env.mjs";

const logger = createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: [
    new transports.Console({
      format: format.combine(format.json(), format.prettyPrint(), format.colorize())
    })
  ],
  exitOnError: false
})

const info = logger.info
const warn = logger.warn
const log = logger.log
const error = logger.error
const debug = logger.debug

export {
  logger,
  warn,
  info,
  log,
  error,
  debug,
}
