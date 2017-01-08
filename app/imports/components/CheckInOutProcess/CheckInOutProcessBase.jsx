import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {propTypes} from 'react-router';

// Import components
import Button from '../Button/Button';

class CheckInOutProcessBase extends Component {
  constructor(props) {
    super(props);
  }

  setObjectReserved() {
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), 'reserved');
  }

  setObjectInUse() {
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), 'inuse');
  }

  setObjectAvailable() {
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), 'available');
  }

  setObjectOutOfOrder() {
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), 'outoforder');
  }

  renderButtonsForProvider() {
      if(this.props.object.state.state=='reserved') {
        return (<Button onClick={() => this.setObjectAvailable() } buttonStyle="huge">Annuleer reservering!</Button>);
      } else if(this.props.object.state.state=='inuse') {
        return (<Button onClick={() => this.setObjectAvailable() } buttonStyle="huge">Annuleer verhuur!</Button>);
      } else if(this.props.object.state.state=='outoforder') {
        return (<Button onClick={() => this.setObjectAvailable() } buttonStyle="huge">Maak beschikbaar!</Button>);
      } 

      return (<Button onClick={() => this.setObjectOutOfOrder() } buttonStyle="huge">Maak niet beschikbaar!</Button>);
  }

  render() {
    return (<div />);
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
