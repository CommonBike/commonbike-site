import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {propTypes} from 'react-router';

import { getUserDescription } from '/imports/api/users.js'; 

// Import components
import Button from '../Button/Button';

class CheckInOutProcessBase extends Component {
  constructor(props) {
    super(props);
  }

  setObjectReserved() {
    var newState = 'reserved';
    var user = getUserDescription(Meteor.user());
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), this.props.object.locationId,newState, user);
  }

  setObjectInUse() {
    var newState = 'inuse'
    var user = getUserDescription(Meteor.user());
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), this.props.object.locationId, newState, user);
  }

  setObjectAvailable() {
    var newState = 'available'
    Meteor.call('objects.setState', this.props.object._id, null, this.props.object.locationId, newState, '');
  }

  setObjectOutOfOrder() {
    var newState = 'outoforder'
    var user = getUserDescription(Meteor.user());
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), this.props.object.locationId, newState, user);
  }

  renderButtonsForProvider() {
      if(this.props.object.state.state=='reserved') {
        return (<Button onClick={() => this.setObjectAvailable() } buttonStyle="hugeSmallerFont">Annuleer Reservering</Button>);
      } else if(this.props.object.state.state=='inuse') {
        return (<Button onClick={() => this.setObjectAvailable() } buttonStyle="hugeSmallerFont">Annuleer Verhuur</Button>);
      } else if(this.props.object.state.state=='outoforder') {
        return (<Button onClick={() => this.setObjectAvailable() } buttonStyle="hugeSmallerFont">Maak Beschikbaar</Button>);
      } 

      return (<Button onClick={() => this.setObjectOutOfOrder() } buttonStyle="hugeSmallerFont">Maak Niet Beschikbaar</Button>);
  }

  renderButtonsForUser() {
      return (<div />);
  }

  render() {
    if(this.props.isProvider) {
      return this.renderButtonsForProvider();
    } else {
      return this.renderButtonsForUser();
    }
  }
}

CheckInOutProcessBase.propTypes = {
  locationId: PropTypes.string,
  object: PropTypes.object,
  isProvider: PropTypes.any
};

CheckInOutProcessBase.defaultProps = {
  locationId: null,
  object: null,
  isProvider: false
}

export default CheckInOutProcessBase;
