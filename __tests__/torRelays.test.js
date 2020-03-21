const { torIpList } = require('./fixtures')
const { update } = require('../lib/torRelays')
const store = require('../lib/store')

const cleanUp = () => {
  store.clean()
  jest.clearAllMocks()
}

beforeEach(cleanUp)

afterAll(cleanUp)

describe.only('torRelays behaviour', () => {
  test.only('Update should refresh database', async (done) => {
    expect(store.getTotal()).toBe(0)
    await update()
    expect(store.getNodes()).toEqual(torIpList)
    done()
  })
})
