import { getSettingsServerSide, Settings } from '/imports/api/settings.js';

const Payments = new Mongo.Collection('payments') // XXX We probably want this have schema attached and moved somewhere else
global.Payments = Payments  // for debugging

const nBCperEuro = 100
const nEuroperETH = 10000 // for paying transaction gas while using BikeCoins

// code: https://github.com/mollie/mollie-api-node
// api reference: https://www.mollie.com/nl/docs/reference/payments/create?utm_source=mollie&utm_medium=dashboard&utm_campaign=integration&utm_content=nl

const Mollie = require('mollie-api-node')
const mollie = new Mollie.API.Client

const apiKey = 'test_URmqjja4mgBjPmVSnPjc5waVmumDtP'
mollie.setApiKey(apiKey)

const bluebird = require("bluebird")
// console.log('bluebird promise...')
// console.log(promise)

// console.log('meteor/promise...')   // import { Promise } from 'meteor/promise'
// console.log(Promise)

const mollie_payments_create_withCB = (args, cb) => {
  mollie.payments.create(args, (payment) => cb(null, payment))
}
const mollie_payments_create = bluebird.promisify(mollie_payments_create_withCB)

const mollie_payments_get_withCB = (args, cb) => {
  mollie.payments.get(args, (payment) => cb(null, payment))
}
const mollie_payments_get    = bluebird.promisify(mollie_payments_get_withCB)


export const UpdatePaymentOrder = (paymentOrder) => {
  if (paymentOrder.status !== 'open') return

  mollie.payments.get(paymentOrder.externalPaymentId, Meteor.bindEnvironment(function(payment) {
    if (payment.error) {
      console.error(payment)
      return
    }

    if (paymentOrder.status !== payment.status) {
      if (payment.status === 'paid') { // note: we could immediately show the updated BC end ETH balances if we feel the blockchain takes to long but this smells like premature optimization.
        const userId      = paymentOrder.userId
        const userAddress = Meteor.users.findOne(userId).profile.wallet.address
        const nBikeCoins  = paymentOrder.amount * nBCperEuro
        const nEther      = paymentOrder.amount / nEuroperETH

        const web3 = BikeCoin.web3()
        web3.eth.getTransactionCount(Settings.findOne().bikecoin.wallet.address, Meteor.bindEnvironment((error, baseNonce) => {
          // console.log('base nonce', baseNonce)
          // XXX this is a hack for doing multiple transaction during the same block. They should have a different nonce but this does not happen automatically :-(
          BikeCoin.bikeCoinsSendByApp(userAddress, nBikeCoins, baseNonce)
          BikeCoin.etherSendByApp(userAddress, nEther, baseNonce + 1)
        }))
      }

      paymentOrder.status = payment.status
      Payments.update(paymentOrder._id, paymentOrder)
      console.log(paymentOrder)
    }
  }))
}


export const UpdateAllPaymentOrders = () => { // note: also called in by visiting /api/payment/webhook/mollie/v1
  // console.log('UpdateAllPaymentOrders')
  for (const paymentOrder of Payments.find({status: 'open'}).fetch()) {
    UpdatePaymentOrder(paymentOrder)
  }
}

const oneMinute = 60 * 1000
Meteor.setInterval(UpdateAllPaymentOrders, oneMinute)


Meteor.methods({
  'paymentservice.create'(amount) { // amount is in euros
    check(amount, Number)
    if (!this.userId) throw new Meteor.Error('not-authorized');

    var settings = getSettingsServerSide();
    const baseUrl = settings.baseUrl || 'https://develop.common.bike'
    const internalPaymentId = Random.id()

    // https://www.mollie.com/nl/docs/reference/payments/create
    const payment = Promise.await(mollie_payments_create({
      amount:      amount,
      description: 'Buy BikeCoins',
      redirectUrl: `${baseUrl}/payment/${internalPaymentId}`,
      webhookUrl:  `${baseUrl}/api/payment/webhook/mollie/v1`
    }))

    if (payment.error) {
      console.error(payment)
      return
    }
    // console.log(payment)

    const paymentOrder = {
      _id: internalPaymentId,
      userId: this.userId,
      amount: amount,
      status: 'open', // open -> paid/cancelled/failed/expired
      created: new Date(),
      externalPaymentId: payment.id,
      externalUrl: payment.links.paymentUrl,
    }
    Payments.insert(paymentOrder)
    console.log(paymentOrder)

    return paymentOrder.externalUrl
  }, // end of 'paymentservice.create' server method

  'paymentservice.getstatus'(internalPaymentId) {
    check(internalPaymentId, String)
    if (!this.userId) throw new Meteor.Error('not-authorized')

    let paymentOrder = Payments.findOne(internalPaymentId)
    if (!paymentOrder) throw new Meteor.Error('payment order not found')
    if (paymentOrder.userId !== this.userId) throw new Meteor.Error('incorrect user')

    return paymentOrder.status
  },

}) // end of Meteor.methods
