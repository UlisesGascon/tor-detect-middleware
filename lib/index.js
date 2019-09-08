const store = require('./store')

const isExitNode = (ip) => store.getNodes().includes(ip)
const getIp = (req) => req.headers['x-forwarded-for'] || req.connection.remoteAddress

module.exports = (config = {}) => (req, res, next) => {
  const ip = getIp(req)

  req.isTorUser = isExitNode(ip)

  if (req.isTorUser && config.tor) {
    return res.redirect(config.tor)
  }

  if (!req.isTorUser && config.surface) {
    return res.redirect(config.surface)
  }

  next()
}
