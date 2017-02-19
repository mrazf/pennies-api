const nodemailer = require('nodemailer')
const logger = require('../logger')
const config = require('../config/private/email.json')

const emailer = nodemailer.createTransport(`smtps://${config.address}:${config.password}@smtp.gmail.com`)

const send = options => {
  return new Promise((resolve, reject) => {
    emailer.sendMail(options, (error, info) => {
      if (error) {
        logger.error(`Emailer: ${error} at ${error.stack}`)
        reject(error)
      }
    })
  })
}

const formatOptions = (title, body) => {
  return {
    from: config.address,
    to: config.address,
    subject: `Pennies: ${title}`,
    text: body
  }
}

const info = ({ title, body }) => {
  return send(formatOptions(title, body))
}

const error = ({ area, err }) => {
  const title = `Pennies: error in ${area}`
  const body = `${err} \n\n ${err.stack}`

  send(formatOptions(title, body))
}

module.exports = { info, error }
