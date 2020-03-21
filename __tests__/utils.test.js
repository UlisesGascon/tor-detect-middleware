
const { simplifiedResponse, ipTor, torIpList } = require('./fixtures')
const { extractIpsfromNode } = require('../lib/utils')

describe.only('extractIpsfromNode behaviour', () => {
  test.only('Should ignore not valid IPs', () => {
    const relays = [{
      or_addresses: [`${ipTor}:4000`, 'fake-IP']
    },
    { or_addresses: ['no-valid'] }]
    const validIps = [ipTor]
    expect(extractIpsfromNode(relays)).toEqual(validIps)
  })

  test.only('Should handle several relays', () => {
    expect(extractIpsfromNode(simplifiedResponse.relays)).toEqual(torIpList)
  })
})
