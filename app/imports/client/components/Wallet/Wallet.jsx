import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import { RedirectTo } from '/client/main'
import { StyleProvider } from '../../StyleProvider.js'

// Import components
import Balance from '/imports/client/components/Balance/Balance.jsx';

class Wallet extends Component {

  constructor(props) {
    super(props);
  }

  buyBikeCoin(bikecoins) {
    console.log('buy bikecoins' + bikecoins);
  }

  render() {
    return (
      <div style={s.base}>
        <Balance label="SALDO" address={this.props.address} providerurl={this.props.providerurl} /> : <div />

        <Button onClick={() => this.buyBikeCoin(100) } buttonStyle="hugeSmallerFont">BUY 100 BIKECOIN</Button>
      </div>
    );
  }
}

var s = StyleProvider.getInstance().checkInOutProcess;

Wallet.propTypes = {
  wallettype: PropTypes.string,
  providerurl: PropTypes.string,
  address: PropTypes.string
};

Wallet.defaultProps = {
  wallettype: 'user',
  providerurl: '',
  address: ''
}

export default Wallet
