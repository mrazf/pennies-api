const fs = require('fs')
const request = require('request')
const logger = require('../logger')

const validateAndReturnToken = (config, apiToken, mtime) => {
  const expiryTime = new Date(mtime).setSeconds(mtime.getSeconds() + apiToken.expires_in)

  return new Promise((resolve, reject) => {
    if (new Date() < new Date(expiryTime)) return resolve(apiToken.access_token)

    const options = {
      url: 'https://api.monzo.com/oauth2/token',
      form: {
        grant_type: 'refresh_token',
        client_id: config.monzo.clientId,
        client_secret: config.monzo.clientSecret,
        refresh_token: config.monzo.refresh_token
      }
    }

    request.post(options, (err, resCode, body) => {
      if (err) reject(err)

      const accessToken = JSON.parse(body)
      fs.writeFileSync('./src/config/private/monzoApiToken.json', JSON.stringify(accessToken, null, 2))

      resolve(accessToken.access_token)
    })
  })
}

const getTransactions = (config, accessToken) => {
  const since = config.pennies.lastProcessedTransaction || ''
  const url = `https://api.monzo.com/transactions?account_id=${config.monzo.accountId}&expand[]=merchant`
  const headers = { Authorization: `Bearer ${accessToken}` }

  return new Promise((resolve, reject) => {
    logger.info(`GET ${url}`)
    request.get(url, { headers }, (err, res, body) => {
      if (err) {
        logger.error(`GET ${url} errored with ${err} at ${err.stack}`)

        reject(err)
      }

      const transactions = JSON.parse(body).transactions

      if (!transactions.length) {
        logger.info('GET https://api.monzo.com/transactions got no transactions')
        resolve({ config, transactions })
      }

      logger.log('info', `GET https://api.monzo.com/transactions got ${transactions.length} transactions`)

      resolve({ config, transactions })
    })
  })
}

module.exports = config => {
  let apiToken = JSON.parse(fs.readFileSync('./src/config/private/monzoApiToken.json'))
  let mtime = fs.statSync('./src/config/private/monzoApiToken.json').mtime

  return validateAndReturnToken(config, apiToken, mtime)
          .then(accessToken => getTransactions(config, accessToken))
}
