const ipSurface = '79.189.12.130'
const ipTor = '244.242.84.73'
const torIpList = [ipTor, '9.58.138.153', '180.206.23.192']
const nytUrl = 'https://www.nytimes.com'
const nytTorUrl = 'https://www.nytimes3xbfgragh.onion/'
const emptyDbMsg = 'Tor Database is empty'
const defaultMs = 3600000
const simplifiedResponse = {
  relays: [{
    or_addresses: [ipTor]
  }, { or_addresses: ['9.58.138.153', '180.206.23.192'] }
  ]
}

module.exports = { simplifiedResponse, ipSurface, ipTor, torIpList, nytUrl, nytTorUrl, emptyDbMsg, defaultMs }
