require('./stub')
const fs = require('fs')
const monzoApiToken = require('./private/monzoApiToken')
const monzoClientDetails = require('./private/monzoClientDetails')
const sheetsApiToken = require('./private/sheetsApiToken')
const sheetsClientSecrets = require('./private/sheetsClientSecrets')
const pennies = require('./private/pennies')

const updateLastTransaction = id => {
  pennies.lastProcessedTransaction = id

  fs.writeFileSync('./src/config/private/pennies.json', JSON.stringify(pennies, null, 2))
}

module.exports = {
  monzo: { ...monzoApiToken, ...monzoClientDetails },
  pennies: { ...pennies, updateLastTransaction },
  sheets: {
    apiToken: sheetsApiToken,
    clientSecrets: sheetsClientSecrets
  }
}
