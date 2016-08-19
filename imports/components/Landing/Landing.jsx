import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Accounts } from 'meteor/accounts-base';
import AccountsUIWrapper from '/imports/containers/AccountsUIWrapper/AccountsUIWrapper.jsx';

// Import templates
import LockOverview from '/imports/containers/LockOverview/LockOverview.jsx';

// App component - represents the whole app
export default class Landing extends Component {
 
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>

        <img src="https://avatars0.githubusercontent.com/u/16703580?v=3" />

        <h1>Welkom bij CommonBike!</h1>

        <AccountsUIWrapper />

        {this.props.currentUser ? <LockOverview /> : null}

      </div>
    );
  }
}

export default createContainer((props) => {
  return {
    currentUser: Meteor.user()
  };
}, Landing);
