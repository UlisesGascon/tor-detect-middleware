const store = require('./store')

const isExitNode = (ip) => store.getNodes().includes(ip)
const getIp = (req) => req.headers['x-forwarded-for'] || req.connection.remoteAddress

module.exports = (req, res, next) => {
  const ip = getIp(req)
  req.isTorUser = isExitNode(ip)
  next()
}
