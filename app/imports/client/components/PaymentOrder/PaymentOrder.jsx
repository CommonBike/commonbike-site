import React from 'react'

class PaymentOrder extends React.Component {
  constructor(props) {
    super(props)

    const { orderId } = props.match.params
    this.state = {
      orderId: orderId,
      orderStatus: '<unknown>'
    }

    // console.log('PaymentOrder', this.state)

    Meteor.call('paymentservice.orderstatus', orderId,
      (error, status) => {
        this.setState({orderStatus: status})
        // console.log(status)
      }
    )
  }

  render() {
    return (
      <div>
        <h2>PaymentOrder</h2>
        <p>orderId {this.state.orderId} status is {this.state.orderStatus}</p>
      </div>
    )
  } // end of render()
} // end of class PaymentOrder

export default PaymentOrder
