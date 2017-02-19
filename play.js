const test = require('./build/src/monzo/get-token')
const monzoAppConfig = require('./src/config/private/monzoClientDetails')

test({ config: monzoAppConfig })
