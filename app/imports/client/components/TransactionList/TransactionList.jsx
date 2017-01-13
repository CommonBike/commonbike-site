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
        <p style={s.intro}> 
          {this.props.title}
        </p>

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
  intro: {
    padding: '0 70px',
    margin: '0 auto',
    maxWidth: '400px',
    textAlign: 'left',
    minHeight: '80px',
    fontSize: '1.2em',
    fontWeight: '500',
    background: 'url("/files/ObjectList/marker.svg") 0 0 / auto 60px no-repeat',
  },

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
