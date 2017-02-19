const nock = require('nock')

if (process.argv.includes('stub')) {
  const transactions = require('../../stubs/transactions')

  nock('https://api.monzo.com', { allowUnmocked: true })
    .filteringPath(() => '/transactions')
    .get('/transactions')
    .query(true)
    .reply(200, transactions)
}
