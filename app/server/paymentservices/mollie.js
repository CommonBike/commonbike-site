const Mollie = require("mollie-api-node") // https://github.com/mollie/mollie-api-node

const mollie = new Mollie.API.Client
const apiKey = 'test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM' // default from github example
mollie.setApiKey(apiKey)

const PaymentService = () => {
  // console.log('This is the Mollie PaymentService')
}

export default PaymentService
