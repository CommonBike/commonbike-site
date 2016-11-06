import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Accounts } from 'meteor/accounts-base';
import AccountsUIWrapper from '/imports/containers/AccountsUIWrapper/AccountsUIWrapper.jsx';

// Import templates
import LockOverview from '/imports/containers/LockOverview/LockOverview.jsx';

// App component - represents the whole app
class Landing extends Component {
 
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div style={s.base}>
        <div style={s.content}>

          <p>
            {this.props.currentUser ? '' : 'Welkom bij CommonBike. Log in om te starten.'}
          </p>

          <AccountsUIWrapper />

          {this.props.currentUser ? <BikePicker /> : null}

        </div>
      </div>
    );
  }
}

var s = {
  base: {
    width: '100%',
  },
  content: {
    padding: '15px'
  }
}

export default createContainer((props) => {
  return {
    currentUser: Meteor.user()
  };
}, Landing);
