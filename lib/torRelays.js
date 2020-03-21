const debug = require('debug')('tor-detect-middleware')
const { setNodes } = require('./store')
const got = require('got')
const { extractIpsfromNode } = require('./utils')
const downloadJson = (url) => got(url).then(res => JSON.parse(res.body))

let interval

const update = async () => {
  try {
    debug('Latest TOR data will be downloaded')
    const data = await downloadJson('https://onionoo.torproject.org/details')
    debug(`Total TOR relays in scope: ${data.relays.length}`)
    const ips = extractIpsfromNode(data.relays)
    setNodes(ips)
  } catch (err) {
    throw new Error(err)
  }
}

const start = async (ms) => {
  await update() // First time
  interval = setInterval(update, ms) // Refresh
}

const stop = () => interval ? clearInterval(interval) : null

module.exports = {
  start,
  stop,
  update
}
