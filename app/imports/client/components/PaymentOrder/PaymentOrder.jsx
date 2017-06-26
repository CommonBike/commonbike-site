import React from 'react'
import RaisedButton from '/imports/client/components/Button/RaisedButton.jsx';

class PaymentOrder extends React.Component {
  constructor(props) {
    super(props)

    const { internalPaymentId } = props.match.params
    this.state = {
      internalPaymentId: internalPaymentId,
      paymentStatus: '?'
    }

    // console.log('PaymentOrder', this.state)

    Meteor.call('paymentservice.getstatus', internalPaymentId,
      (error, status) => {
        if (error) return console.error(error)
        this.setState({paymentStatus: status})
        // console.log(status)
      }
    )
  }

  onAgain() {
    document.location = "/commonbike-ui"
  }

  render() {
    return (
      <div>
        <h2>Payment order {this.state.internalPaymentId} is {this.state.paymentStatus}</h2>
        <RaisedButton onClick={this.onAgain}>Again</RaisedButton>

      </div>
    )
  } // end of render()
} // end of class PaymentOrder

export default PaymentOrder
