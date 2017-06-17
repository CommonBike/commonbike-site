if (Meteor.isServer) {
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

  let paymentId = undefined // XXX this will soon move to a payments collection

  Meteor.methods({
    'paymentservice.create'(amount) { // amount is in euros
      check(amount, Number)
      if (!this.userId) throw new Meteor.Error('not-authorized');

      const baseUrl = Meteor.settings.private.baseUrl || 'https://develop.common.bike' // XXX get this from settings instead?
      const orderId = Random.id()
      const customerId = this.userId

      // https://www.mollie.com/nl/docs/reference/payments/create
      const payment = Promise.await(mollie_payments_create({
        amount:      amount,
        description: 'Buy BikeCoins',
        redirectUrl: `${baseUrl}/payment/${orderId}`,
        webhookUrl:  `${baseUrl}/payment/webhook`
      }))

      if (payment.error) {
        console.error(payment)
        return
      }

      // console.log(payment)
      paymentId = payment.id // XXX only for now
      const order = {
        paymentId: payment.id,
        orderId: orderId,
        customerId: customerId
      }
      // console.log(order)
      // TODO: store order object in 'payments' Mongo collection

      console.log('order', orderId, 'for', amount, 'euro handled by visiting', payment.links.paymentUrl)
      return payment.links.paymentUrl
    }, // end of 'paymentservice.create' server method

    // TODO: we should have a webhook function here that is handled on the server instead of on the client

    'paymentservice.orderstatus'(orderId) {
      check(orderId, String)
      if (!this.userId) throw new Meteor.Error('not-authorized');

      // TODO: get data from payments collection

      const payment = Promise.await(mollie_payments_get(paymentId))
      if (payment.error) {
        console.error(payment)
        return
      }

      console.log('order', orderId, 'with paymentId', paymentId, 'is', payment.status)

      // if (payment.isPaid()) {
      //   console.log('order', orderId, 'payment received')
      // }

      return payment.status
    },

  }) // end of Meteor.methods
} // end of Meteor.isServer
