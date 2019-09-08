const torUserHandler = require('../lib')
const store = require('../lib/store')

const populateDB = nodes => {
  store.setNodes(nodes)
  expect(store.getNodes()).toEqual(nodes)
}

const mockResponse = () => {
  const res = {}
  res.redirect = jest.fn()
  return res
}

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

describe.skip('Tor Detect Middelware strict mode behaviour', () => {
  test('Should stop th server if the onioono service is down in strict Mode', () => {})
  test('Should wait until there is available data in the store in strict Mode', () => {})
})

describe.skip('Tor Detect Middelware CRON behaviour', () => {
  test('Should refresh the store every hour by default', () => {})
  test('Should refresh the store with a custom CRON Job', () => {})
})

describe('Tor Detect Middelware REDIRECT behaviour', () => {
  test.skip('should redirect a surface user', (done) => {
    populateDB(['IP-TOR', 'IP-TOR-2'])
    const req = mockRequest('IP-SURFACE')
    const res = mockResponse()

    torUserHandler({
      surface: 'https://www.nytimes.com'
    })(req, res, () => {
      expect(res.redirect).toHaveBeenCalled()
      done()
    })
  })

  test('should not redirect a surface user', (done) => {
    populateDB(['IP-TOR', 'IP-TOR-2'])
    const req = mockRequest('IP-SURFACE')
    const res = mockResponse()

    torUserHandler()(req, res, () => {
      expect(res.redirect).not.toHaveBeenCalled()
      done()
    })
  })

  test.skip('should redirect a TOR user', (done) => {
    populateDB(['IP-TOR', 'IP-TOR-2'])
    const req = mockRequest('IP-TOR')
    const res = mockResponse()

    torUserHandler({
      tor: 'https://www.nytimes3xbfgragh.onion/'
    })(req, res, () => {
      expect(res.redirect).toHaveBeenCalled()
      done()
    })
  })

  test('should not redirect a TOR user', (done) => {
    populateDB(['IP-TOR', 'IP-TOR-2'])
    const req = mockRequest('IP-TOR')
    const res = mockResponse()

    torUserHandler()(req, res, () => {
      expect(res.redirect).not.toHaveBeenCalled()
      done()
    })
  })
})

describe('Tor Detect Middelware DEFAULT behaviour', () => {
  test('should recognize a TOR IP origin', (done) => {
    populateDB(['IP-TOR', 'IP-TOR-2'])
    const req = mockRequest('IP-TOR')
    const res = mockResponse()

    torUserHandler()(req, res, () => {
      expect(req.isTorUser).toEqual(true)
      done()
    })
  })

  test('Should recognize a surface IP origin', (done) => {
    populateDB(['IP-TOR', 'IP-TOR-2'])
    const req = mockRequest('IP-SURFACE')
    const res = mockResponse()

    torUserHandler()(req, res, () => {
      expect(req.isTorUser).toEqual(false)
      done()
    })
  })

  test.skip('Should not wait until there is available data in the store', () => {})
  test.skip('Should not stop the server if the onioono service is down', () => {})
})

describe.skip('Tor Detect Middelware PURGE behaviour', () => {
  test('Should purge the IP list', () => {})
  test('Should purge the IP list only at the startup', () => {})
})
