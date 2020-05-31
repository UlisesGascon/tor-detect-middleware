const ipRegex = require('ip-regex')
const debug = require('debug')('tor-detect-middleware')

const extractIpsfromNode = (nodes) => {
  debug('IPs extraction has started')
  let ips = []
  nodes.forEach(node => {
    const validIps = node.or_addresses.join().match(ipRegex())
    const isExitNode = node.flags.includes('Exit')
    if (validIps && isExitNode) {
      ips = ips.concat(validIps)
    }
  })
  debug(`IPs extraction has ended. Total Ips : ${ips.length}`)
  return ips
}

module.exports = { extractIpsfromNode }
