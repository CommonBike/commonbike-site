import React from 'react'
import RaisedButton from '/imports/client/components/Button/RaisedButton.jsx';

class PaymentOrder extends React.Component {
  constructor(props) {
    super(props)

    const { orderId } = props.match.params
    this.state = {
      orderId: orderId,
      orderStatus: '?'
    }

    // console.log('PaymentOrder', this.state)

    Meteor.call('paymentservice.orderstatus', orderId,
      (error, status) => {
        this.setState({orderStatus: status})
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
        <h2>order {this.state.orderId} is {this.state.orderStatus}</h2>
        <RaisedButton onClick={this.onAgain}>Again</RaisedButton>

      </div>
    )
  } // end of render()
} // end of class PaymentOrder

export default PaymentOrder
