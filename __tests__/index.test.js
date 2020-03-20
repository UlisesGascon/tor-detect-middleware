const torUserHandler = require('../lib')
const store = require('../lib/store')

const ipSurface = '79.189.12.130'
const ipTor = '244.242.84.73'
const torIpList = [ipTor, '9.58.138.153', '180.206.23.192']

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

beforeEach((done) => {
  store.clean()
  done()
})

afterAll((done) => {
  store.clean()
  done()
})

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

  test.skip('Should not wait until there is available data in the store', () => {})
  test.skip('Should not stop the server if the onioono service is down', () => {})
})

describe.skip('strict mode behaviour', () => {
  test('Should stop th server if the onioono service is down in strict Mode', () => {})
  test('Should wait until there is available data in the store in strict Mode', () => {})
})

describe.skip('Interval behaviour', () => {
  test('Should refresh the store every hour by default', () => {})
  test('Should refresh the store with a custom interval', () => {})
})

describe('Redirect behaviour', () => {
  test.skip('should redirect a surface user', (done) => {
    populateDB(torIpList)
    const req = mockRequest(ipSurface)
    const res = mockResponse()
    const next = mockNext()

    torUserHandler({
      surface: 'https://www.nytimes.com'
    })(req, res, () => {
      expect(res.redirect).toHaveBeenCalled(1)
      expect(next).not.toHaveBeenCalled()
      done()
    })
  })

  test('should not redirect a surface user', (done) => {
    populateDB(torIpList)
    const req = mockRequest(ipSurface)
    const res = mockResponse()
    const next = mockNext()

    torUserHandler()(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
    done()
  })

  test('should redirect a TOR user', (done) => {
    populateDB(torIpList)
    const req = mockRequest(ipTor)
    const res = mockResponse()
    const next = mockNext()

    torUserHandler({
      tor: 'https://www.nytimes3xbfgragh.onion/'
    })(req, res, next)

    // https://stackoverflow.com/a/48889610
    expect(next).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledTimes(1)
    expect(res.redirect).toHaveBeenCalledWith('https://www.nytimes3xbfgragh.onion/')
    done()

    /* (req, res, () => {
      expect(res.redirect).toHaveBeenCalled()
      done()
    }) */
  })

  test('should not redirect a TOR user', (done) => {
    populateDB(torIpList)
    const req = mockRequest(ipTor)
    const res = mockResponse()

    torUserHandler()(req, res, () => {
      expect(res.redirect).not.toHaveBeenCalled()
      done()
    })
  })
})

describe.skip('Purge behaviour', () => {
  test('Should purge the IP list', () => {})
  test('Should purge the IP list only at the startup', () => {})
})
