const ipSurface = '79.189.12.130'
const ipTor = '244.242.84.73'
const ipTor2 = '180.206.23.192'
const exitTorList = [ipTor, ipTor2]
const nytUrl = 'https://www.nytimes.com'
const nytTorUrl = 'https://www.nytimes3xbfgragh.onion/'
const emptyDbMsg = 'Tor Database is empty'
const defaultMs = 3600000
const simplifiedResponse = {
  relays: [{
    or_addresses: [ipTor],
    flags: ['Exit']
  }, {
    or_addresses: [ipTor2],
    flags: ['Exit']
  }, { or_addresses: ['9.58.138.153'], flags: [] }
  ]
}

module.exports = { simplifiedResponse, ipSurface, exitTorList, ipTor, nytUrl, nytTorUrl, emptyDbMsg, defaultMs }
