const { simplifiedResponse } = require('../__tests__/fixtures')
const body = JSON.stringify(simplifiedResponse)
module.exports = () => Promise.resolve({ body })
