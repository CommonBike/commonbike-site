if (Meteor.isServer) {
  // code: https://github.com/mollie/mollie-api-node
  // api reference: https://www.mollie.com/nl/docs/reference/payments/create?utm_source=mollie&utm_medium=dashboard&utm_campaign=integration&utm_content=nl

  const Mollie = require('mollie-api-node')
  const mollie = new Mollie.API.Client

  const apiKey = 'test_URmqjja4mgBjPmVSnPjc5waVmumDtP'
  mollie.setApiKey(apiKey)

  let paymentId = undefined // XXX this will soon move to a payments collection

  Meteor.methods({
    'paymentservice.create'(amount) { // amount is in euros
      check(amount, Number)
      if (!this.userId) throw new Meteor.Error('not-authorized');

      const baseUrl = Meteor.settings.private.baseUrl || 'https://develop.common.bike' // XXX get this from settings instead?
      const orderId = Random.id()
      const customerId = this.userId

      // https://www.mollie.com/nl/docs/reference/payments/create
      // XXX run this sychronously so we can return the redirectUrl to the client
      mollie.payments.create({
        amount:      amount,
        description: 'Buy BikeCoins',
        redirectUrl: `${baseUrl}/payment/${orderId}`,
        webhookUrl:  `${baseUrl}/payment/webhook`
      }, function (payment) {
        if (payment.error) {
          console.error(payment)
          return
        }

        paymentId = payment.id // XXX only for now
        const order = {
          paymentId: payment.id,
          orderId: orderId,
          customerId: customerId
        }
        // TODO: store order object in 'payments' Mongo collection

        // console.log(payment)
        console.log('paymentservice.create', amount, 'euro(s) in order', orderId, 'by visiting', payment.links.paymentUrl)
      }) // end of payment callback
    }, // end of 'paymentservice.create' server method

    // TODO: we should have a webhook function here that is handled on the server instead of on the client

    'paymentservice.orderstatus'(orderId) {
      check(orderId, String)
      if (!this.userId) throw new Meteor.Error('not-authorized');

      // TODO: get data from payments collection

      const orderStatus = '<result in server log>'

      // XXX run this sychronously so we can return the redirectUrl to the client
      mollie.payments.get(paymentId, function (payment) {
        if (payment.error) {
          console.error(payment)
          return
        }

        console.log('order', orderId, 'with paymentId', paymentId, 'has status', payment.status)

        // if (payment.isPaid()) {
        //   console.log('order', orderId, 'payment received')
        // }
      })

      // console.log('order', orderId, 'has status', orderStatus)
      return orderStatus
    },

  }) // end of Meteor.methods
} // end of Meteor.isServer
