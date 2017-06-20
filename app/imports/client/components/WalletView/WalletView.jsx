// import React, { Component, PropTypes } from 'react';
// import { createContainer } from 'meteor/react-meteor-data';
// import R from 'ramda';
// import { RedirectTo } from '/client/main'
// import { StyleProvider } from '../../StyleProvider.js'
//
// // Import components
// import Balance from '/imports/client/components/Balance/Balance.jsx';
//
// class WalletView extends Component {
//
//   constructor(props) {
//     super(props);
//   }
//
//   getBalance(buyBikeCoin(bikecoins)) {
//     console.log('buy bikecoins' + bikecoins);
//   }
//
//   render() {
//     return (
//       <div style={s.base}>
//         { item&&item.wallet ?
//            <Balance label="SALDO" address={this.props.wallet_address} providerurl="this.props.providerurl" /> : <div />
//          }
//
//         <Button onClick={() => this.buyBikeCoin(100) } buttonStyle="hugeSmallerFont">BUY 100 BIKECOIN</Button>
//       </div>
//     );
//   }
// }
//
// var s = StyleProvider.getInstance().checkInOutProcess;
//
// WalletView.propTypes = {
//   address: PropTypes.String,
//   isEditable: PropTypes.any,
//   location: PropTypes.object,
//   object: PropTypes.object,
// };
//
// WalletView.defaultProps = {
//   isEditable: false,
//   location: {},
//   object: {},
// }
//
// export default WalletView
