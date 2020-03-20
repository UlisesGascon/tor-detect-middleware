const debug = require('debug')('tor-detect-middleware')
const store = require('./store')
const { start } = require('./torRelays')

const isExitNode = (ip) => store.getNodes().includes(ip)
const getIp = (req) => req.headers['x-forwarded-for'] || req.connection.remoteAddress
const ONE_HOUR_MS = 3600000

module.exports = (opt = {}) => {
  if (opt.purge) {
    debug('purge has been requested')
    store.clean()
  }

  const config = Object.assign({ refreshMs: ONE_HOUR_MS }, opt)
  debug(`config has been defined: ${JSON.stringify(config)}`)

  start(config.refreshMs)

  return (req, res, next) => {
    const ip = getIp(req)
    debug(`Current IP: ${ip}`)

    if (config.strictMode && !store.getTotal()) {
      debug(`Database is empty and stricMode is enable. ${ip} is rejected`)
      next('Tor Database is empty')
    }

    req.isTorUser = isExitNode(ip)

    if (req.isTorUser && config.tor) {
      debug(`TOR IP: ${ip} is redirected to ${config.tor}`)
      return res.redirect(config.tor)
    }

    if (!req.isTorUser && config.surface) {
      debug(`SURFACE IP: ${ip} is redirected to ${config.surface}`)
      return res.redirect(config.surface)
    }

    debug(`Current IP ${ip}. isTorUser: ${req.isTorUser}`)
    next()
  }
}
