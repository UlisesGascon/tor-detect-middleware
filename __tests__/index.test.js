describe.skip('Tor Detect Middelware strict mode behaviour', () => {
  test('Should stop th server if the onioono service is down in strict Mode', () => {})
  test('Should wait until there is available data in the store in strict Mode', () => {})
})

describe.skip('Tor Detect Middelware CRON behaviour', () => {
  test('Should refresh the store every hour by default', () => {})
  test('Should refresh the store with a custom CRON Job', () => {})
})

describe.skip('Tor Detect Middelware REDIRECT behaviour', () => {
  test('should redirect a surface user', () => {})
  test('should not redirect a surface user', () => {})
  test('should redirect a TOR user', () => {})
  test('should not redirect a TOR user', () => {})
})

describe.skip('Tor Detect Middelware DEFAULT behaviour', () => {
  test('should recognize a TOR IP origin', () => {})
  test('Should recognize a surface IP origin', () => {})
  test('Should not wait until there is available data in the store', () => {})
  test('Should not stop the server if the onioono service is down', () => {})
})

describe.skip('Tor Detect Middelware PURGE behaviour', () => {
  test('Should purge the IP list', () => {})
  test('Should purge the IP list only at the startup', () => {})
})
