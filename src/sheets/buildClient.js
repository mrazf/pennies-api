const GoogleAuth = require('google-auth-library')
const config = require('../config')

module.exports = () => {
  const clientSecrets = config.sheets.clientSecrets
  const auth = new GoogleAuth()
  const oauth2Client = new auth.OAuth2(clientSecrets.installed.client_id, clientSecrets.installed.client_secret, clientSecrets.installed.redirect_uris[0])

  oauth2Client.credentials = config.sheets.apiToken

  return oauth2Client
}
