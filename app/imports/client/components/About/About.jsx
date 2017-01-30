import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import Radium, { StyleRoot } from 'radium';
import R from 'ramda';

import SignUpButton from '../SignUpButton/SignUpButton.jsx';
import Hr from '../Hr/Hr.jsx';

class Join extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.flex).style.display = 'flex';
  }

  render() {
    return (
      <div style={s.base}>

        <h2>Give kuddo's</h2>

        <p>Do you like this app? Want to support the developers?</p>

        <p>Donate your Satoshi or Bitcoins! How much do you like CommonBike this month?</p>

        <p>Calculation example:</p>

        <ul>
          <li><tt><b>*****</b> (2 * 5) = <b>10</b> mBTC</tt></li>
          <li><tt><b> ****</b> (2 * 4) = <b> 8</b> mBTC</tt></li>
          <li><tt><b>  ***</b> (2 * 3) = <b> 6</b> mBTC</tt></li>
          <li><tt><b>   **</b> (2 * 2) = <b> 4</b> mBTC</tt></li>
          <li><tt><b>    *</b> (2 * 1) = <b> 2</b> mBTC</tt></li>
        </ul>

        <img src="https://i.imgur.com/dvk92Zu.png" />

        <p>CommonBike: Bikes of the Commons.</p>

      </div>
    );
  }
}

var s = {
  base: {
    maxWidth: '400px',
    margin: '0 auto',
    textAlign: 'left',
  },
}

Join.propTypes = {
};

export default createContainer((props) => {
  return {
    currentUser: Meteor.user()
  };
}, Radium(Join));
