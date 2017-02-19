const logger = require('./logger')
const monzo = require('./monzo')
const sheets = require('./sheets')
const config = require('./config')

monzo(config)
  .then(sheets)
  .catch(err => {
    logger.error(`${err} at ${err.stack}`)
  })
