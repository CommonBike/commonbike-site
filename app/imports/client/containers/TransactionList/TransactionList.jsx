import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import models
import { Transactions } from '/imports/api/transactions.js'; 

// Import components
import TransactionListComponent from '../../components/TransactionList/TransactionList';

/**
 *  TransactionList
 * 
 * @param {Object} locations
 * @param {Boolean} isEditable
 */
class TransactionList extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TransactionListComponent title={this.props.title} transactions={this.props.transactions} />
    );
  }

}

var s = {
  base: {
    padding: '10px 20px'
  },
  paragraph: {
    padding: '0 20px'
  }
}

TransactionList.propTypes = {
  transactions: PropTypes.array,
};

TransactionList.defaultProps = {
}

export default createContainer((props) => {
  Meteor.subscribe('transactions');
  
  // var filter=null;
  // var title="";
  // if(!props.isEditable) {
  //   title = 'Bekijk hier jouw reserveringen';
  //   filter = {$or: [{'state.state': 'reserved'}, {'state.state': 'inuse'}], 'state.userId':Meteor.userId()};
  // } else {
  //   title = 'Jouw verhuurde fietsen';

  //   // only show objects for which the current loggedin user is one of the providers
  //   console.log(Meteor.user());

  //   var mylocations = [];
  //   if(Meteor.user()) {
  //     mylocations = Meteor.user().profile.provider_locations||[];
  //   }

  //   console.log(mylocations)

  //   filter = {$or: [{'state.state': 'reserved'}, {'state.state': 'inuse'}], locationId: { $in: mylocations }};
  // }

  return {
  	title: props.admin ? 'Alle transacties' : 'Mijn geschiedenis',
    transactions: Transactions.find( props.admin ? {} : {userId: Meteor.userId()}, {sort: {timestamp: -1}}).fetch()
  };
}, TransactionList);
