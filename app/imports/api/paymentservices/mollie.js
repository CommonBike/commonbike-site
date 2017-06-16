if (Meteor.isServer) {
  // code: https://github.com/mollie/mollie-api-node
  // api reference: https://www.mollie.com/nl/docs/reference/payments/create?utm_source=mollie&utm_medium=dashboard&utm_campaign=integration&utm_content=nl

  const Mollie = require('mollie-api-node')
  const mollie = new Mollie.API.Client

  const apiKey = 'test_URmqjja4mgBjPmVSnPjc5waVmumDtP'
  mollie.setApiKey(apiKey)

  Meteor.methods({
    'paymentservice.create'(fiatAmount = 10.0) {
      if (!this.userId) throw new Meteor.Error('not-authorized');

      const _this   = this
      const baseUrl = 'https://develop.common.bike'
      const orderId = this.userId // 12345

      mollie.payments.create({
        amount:      fiatAmount,
        description: 'Buy BikeCoins',
        redirectUrl: `${baseUrl}/order/${orderId}/`,
        webhookUrl:  `${baseUrl}/mollie-webhook/`
      }, function (payment) {
        if (payment.error) {
          console.error(payment)
          return
        }

        // response.writeHead(302, { Location: payment.getPaymentUrl() })

        // console.log(payment)
        // console.log(payment.links)
        console.log('paymentservice.create', fiatAmount, _this.userId, payment.links.paymentUrl)

        // console.log(payment)
        // I20170616-19:48:33.194(2)? Payment {
        // I20170616-19:48:33.194(2)?   resource: 'payment',
        // I20170616-19:48:33.195(2)?   id: 'tr_RsQWJpPW7d',
        // I20170616-19:48:33.196(2)?   mode: 'test',
        // I20170616-19:48:33.197(2)?   amount: '10.00',
        // I20170616-19:48:33.197(2)?   amountRefunded: undefined,
        // I20170616-19:48:33.198(2)?   amountRemaining: undefined,
        // I20170616-19:48:33.199(2)?   description: 'My first API payment',
        // I20170616-19:48:33.199(2)?   method: null,
        // I20170616-19:48:33.200(2)?   status: 'open',
        // I20170616-19:48:33.205(2)?   createdDatetime: '2017-06-16T17:48:30.0Z',
        // I20170616-19:48:33.207(2)?   paidDatetime: undefined,
        // I20170616-19:48:33.207(2)?   cancelledDatetime: undefined,
        // I20170616-19:48:33.208(2)?   expiredDatetime: undefined,
        // I20170616-19:48:33.208(2)?   expiryPeriod: 'PT15M',
        // I20170616-19:48:33.210(2)?   metadata: null,
        // I20170616-19:48:33.211(2)?   details: null,
        // I20170616-19:48:33.211(2)?   locale: undefined,
        // I20170616-19:48:33.212(2)?   profileId: 'pfl_4PR8AfAUPb',
        // I20170616-19:48:33.212(2)?   customerId: undefined,
        // I20170616-19:48:33.213(2)?   recurringType: undefined,
        // I20170616-19:48:33.213(2)?   mandateId: undefined,
        // I20170616-19:48:33.214(2)?   settlementId: undefined,
        // I20170616-19:48:33.215(2)?   subscriptionId: undefined,
        // I20170616-19:48:33.219(2)?   links:
        // I20170616-19:48:33.220(2)?    { paymentUrl: 'https://www.mollie.com/payscreen/select-method/RsQWJpPW7d',
        // I20170616-19:48:33.220(2)?      webhookUrl: 'https://webshop.example.org/mollie-webhook/',
        // I20170616-19:48:33.234(2)?      redirectUrl: 'https://webshop.example.org/order/12345/' } }
      }) // end of payment callback
    } // end of 'paymentservice.create' server method
  }) // end of Meteor.methods
} // end of Meteor.isServer
