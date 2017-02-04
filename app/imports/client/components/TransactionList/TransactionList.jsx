import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import models
import { Transactions } from '/imports/api/transactions.js'; 

// Import components
import TransactionBlock from '../TransactionBlock/TransactionBlock';

class TransactionList extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={s.base}>
        <div style={s.title}>{this.props.title}</div>

        {R.map((object) =>  <TransactionBlock key={object._id} item={object} />, this.props.transactions)}
      </div>
    );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    padding: '20px 20px 0 20px',
    textAlign: 'center',
    minHeight: 'calc(100vh - 66px)',
  },
  title: {
    fontSize: '1.2em',
    fontWeight: '500',
    maxWidth: '100%',
    width: '400px',
    margin: '10px auto',
    padding: '5px 0',
  }  

}

TransactionList.propTypes = {
  title: PropTypes.string,
  objects: PropTypes.array,
  clickItemHandler: PropTypes.any,

  isEditable: PropTypes.any
};

TransactionList.defaultProps = {
  title: "Bekijk hier jouw geschiedenis",
  transactions: {},
}

export default TransactionList;