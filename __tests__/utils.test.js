
const { exitTorList, simplifiedResponse, ipTor } = require('./fixtures')
const { extractIpsfromNode } = require('../lib/utils')

describe('extractIpsfromNode behaviour', () => {
  test('Should ignore not valid IPs', () => {
    const relays = [{
      or_addresses: [`${ipTor}:4000`, 'fake-IP'],
      flags: ['Exit']
    },
    { or_addresses: ['no-valid'], flags: ['Exit'] }]
    const validIps = [ipTor]

    expect(extractIpsfromNode(relays)).toEqual(validIps)
  })

  test('Should return only exit nodes', () => {
    expect(extractIpsfromNode(simplifiedResponse.relays)).toEqual(exitTorList)
  })
})
