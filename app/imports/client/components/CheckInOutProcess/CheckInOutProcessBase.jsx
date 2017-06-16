import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { getUserDescription } from '/imports/api/users.js';

// Import components
import Button from '../Button/Button';

class CheckInOutProcessBase extends Component {
  constructor(props) {
    super(props);
  }

  validStates() {
    var validStates = ['reserved', 'inuse', 'available', 'outoforder']

    return validStates;
  }

  setObjectState(newState) {
    if(!this.validStates().includes(newState)) {
      return;
    }
    var rentalInfo = {};
    var user = getUserDescription(Meteor.user());
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), this.props.object.locationId, newState, user, rentalInfo);
  }

  setObjectReserved() {
    this.setObjectState('reserved');
  }

  setObjectInUse() {
    this.setObjectState('inuse');
  }

  setObjectAvailable() {
    this.setObjectState('available');
  }

  setObjectOutOfOrder() {
    this.setObjectState('outoforder');
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
