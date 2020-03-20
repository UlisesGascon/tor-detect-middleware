const debug = require('debug')('tor-detect-middleware')
const { setNodes } = require('./store')
const got = require('got')
const ipRegex = require('ip-regex')

const downloadJson = (url) => got(url).then(res => JSON.parse(res.body))

let interval

const extractIps = (nodes) => {
  debug('IPs extraction has started')
  let ips = []
  nodes.forEach(node => {
    const validIps = node.or_addresses.join().match(ipRegex())
    ips = ips.concat(validIps)
  })
  debug(`IPs extraction has ended. Total Ips : ${ips.length}`)
  return ips
}

const updateStore = async () => {
  try {
    debug('Latest TOR data will be downloaded')
    const data = await downloadJson('https://onionoo.torproject.org/details')
    debug(`Total TOR relays in scope: ${data.relays.length}`)
    const ips = extractIps(data.relays)
    setNodes(ips)
  } catch (err) {
    throw new Error(err)
  }
}

const start = async (ms) => {
  await updateStore(ms) // First time
  interval = setInterval(updateStore, ms) // Refresh
}

const stop = () => interval ? clearInterval(interval) : null

module.exports = {
  start,
  stop
}
