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
    const domNode = ReactDOM.findDOMNode(this.refs.flex);
    if (!domNode) {
      console.error('flex domNode not found')
    } else {
      domNode.style.display = 'flex';
    }
  }

  render() {
    return (
      <div style={s.base}>

        <h1>About CommonBike</h1>

        <h2>The project and app</h2>

        <p>...</p>

        <h2>The community</h2>

        <p>
          CommonBike is an open source project made for and by anyone.
        </p>

        <p>
          On <a href="http://slack.common.bike" target="_blank">Slack</a>, Trello (ask on Slack) and <a href="https://github.com/CommonBike/commonbike-site" target="_blank">GitHub</a> you can see all people involved. Slack is for a broad community that want to stay up to date. Trello is for people who'd like to be involved in the 'business development' project. Github is for coders, designers and testers.
        </p>

        <p>
          <b>Owners of things</b>
        </p>

        <p>
          Right now the domain and hosting of common.bike are payed by Bart Roorda and managed by Bart Roorda and Peter Willemsen.
        </p>

        <p>
          The hosting and domain of commonbike.com are payed by Ronald Haverman and managed by Ronald Haverman and Bart Roorda.
        </p>

        <p>
          In the future we would like to use a namecoin or blockstack domain only, combined with a distributed VPS.
        </p>

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
