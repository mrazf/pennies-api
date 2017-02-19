const moment = require('moment')
const write = require('./write')
const emailer = require('../emailer')
const logger = require('../logger')

const format = transaction => {
  const merchant = transaction.merchant ? transaction.merchant.name : 'None'
  const address = transaction.address ? transaction.address.short_format : ''
  const amount = Math.abs(transaction.amount) / 100
  const localAmount = Math.abs(transaction.amount) / 100
  const dateTime = moment(transaction.created).format('D/M/Y HH:mm:ss')

  return [transaction.id, dateTime, amount, transaction.currency, localAmount,
    transaction.local_currency, transaction.category, merchant, transaction.description, address, transaction.notes]
}

module.exports = ({ config, transactions }) => {
  return new Promise((resolve, reject) => {
    const filtered = transactions.filter(t => t.include_in_spending)
    const formatted = filtered.map(format)

    if (!formatted.length) {
      logger.info('Sheets: no transactions to export')
      resolve()
    }

    logger.info(`Sheets: writing ${formatted.length}`)
    const emailerData = {
      title: `exported ${formatted.length} new transactions`,
      data: formatted
    }

    write(config.pennies, formatted)
      .then(config.pennies.updateLastTransaction)
      .then(lastTransaction => emailer.info(emailerData))
      .catch(reject)

    resolve()
  })
}
