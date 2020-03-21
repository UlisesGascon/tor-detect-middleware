const torUserHandler = require('../lib')
const store = require('../lib/store')
const torRelays = require('../lib/torRelays')
const { ipSurface, ipTor, torIpList, nytUrl, nytTorUrl, emptyDbMsg, defaultMs } = require('./fixtures')

// Mocking
jest.mock('../lib/torRelays')

const populateDB = nodes => {
  store.setNodes(nodes)
  expect(store.getNodes()).toEqual(nodes)
}

const mockResponse = () => {
  const res = {}
  res.redirect = jest.fn()
  return res
}

const mockNext = () => jest.fn()

const mockRequest = (ip) => {
  const req = {
    headers: {},
    connection: {}
  }
  req.connection.remoteAddress = ip
  return req
}
const cleanUp = () => {
  store.clean()
  jest.clearAllMocks()
}
beforeEach(cleanUp)

afterAll(cleanUp)

describe('Default behaviour', () => {
  test('should recognize a TOR IP origin', (done) => {
    populateDB(torIpList)
    const req = mockRequest(ipTor)
    const res = mockResponse()

    torUserHandler()(req, res, () => {
      expect(req.isTorUser).toEqual(true)
      done()
    })
  })

  test('Should recognize a surface IP origin', (done) => {
    populateDB(torIpList)
    const req = mockRequest(ipSurface)
    const res = mockResponse()

    torUserHandler()(req, res, () => {
      expect(req.isTorUser).toEqual(false)
      done()
    })
  })
})

describe('strict mode behaviour', () => {
  test('Should block TOR user if there is no available data in the store', () => {
    const req = mockRequest(ipTor)
    const res = mockResponse()
    const next = mockNext()

    populateDB([])
    expect(store.getTotal()).toBe(0)
    torUserHandler({
      strictMode: true
    })(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(emptyDbMsg)
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.redirect).not.toHaveBeenCalled()
    expect(store.getTotal()).toBe(0)
  })

  test('Should block SURFACE user if there is no available data in the store', () => {
    const req = mockRequest(ipSurface)
    const res = mockResponse()
    const next = mockNext()

    populateDB([])
    torUserHandler({
      strictMode: true
    })(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(emptyDbMsg)
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.redirect).not.toHaveBeenCalled()
  })

  test('Should not block TOR users if there is no available data in the store', () => {
    const req = mockRequest(ipTor)
    const res = mockResponse()
    const next = mockNext()

    populateDB([])
    torUserHandler()(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })
})

describe('Interval behaviour', () => {
  test('Should refresh the store every hour by default', () => {
    torUserHandler()
    expect(torRelays.start).toHaveBeenCalledTimes(1)
    expect(torRelays.start).toHaveBeenCalledWith(defaultMs)
  })
  test('Should refresh the store with a custom interval', () => {
    const refreshMs = 1000
    torUserHandler({ refreshMs })
    expect(torRelays.start).toHaveBeenCalledTimes(1)
    expect(torRelays.start).toHaveBeenCalledWith(refreshMs)
  })
})

describe('Redirect behaviour', () => {
  test('should redirect a SURFACE user', () => {
    populateDB(torIpList)
    const req = mockRequest(ipSurface)
    const res = mockResponse()
    const next = mockNext()

    torUserHandler({
      surface: nytUrl
    })(req, res)
    expect(res.redirect).toHaveBeenCalledTimes(1)
    expect(res.redirect).toHaveBeenCalledWith(nytUrl)
    expect(next).not.toHaveBeenCalled()
  })

  test('should redirect a TOR user', () => {
    populateDB(torIpList)
    const req = mockRequest(ipTor)
    const res = mockResponse()
    const next = mockNext()

    torUserHandler({
      tor: nytTorUrl
    })(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledTimes(1)
    expect(res.redirect).toHaveBeenCalledWith(nytTorUrl)
  })

  test('should not redirect ANY user', () => {
    populateDB(torIpList)
    const req = mockRequest(ipSurface)
    const res = mockResponse()
    const next = mockNext()

    torUserHandler()(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })
})

describe('Purge behaviour', () => {
  test('Should purge the IP list only at the startup', () => {
    populateDB(torIpList)
    expect(store.getTotal()).toBe(3)
    torUserHandler({ purge: true })
    expect(store.getTotal()).toBe(0)
  })
})
