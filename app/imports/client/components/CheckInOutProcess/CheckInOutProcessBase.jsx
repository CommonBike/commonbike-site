import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {propTypes} from 'react-router';

// Import components
import Button from '../Button/Button';

class CheckInOutProcessBase extends Component {
  constructor(props) {
    super(props);
  }

  getStateChangeNeatDescription(newState) {
      var description = ""
      if(newState=='reserved') {
        description = this.props.object.title + " gereserveerd"
      } else if(newState=='inuse') {
        description = this.props.object.title + " gehuurd"
      } else if(newState=='available') {
        description = this.props.object.title + " teruggebracht"
      } else if(newState=='outoforder') {
        description = this.props.object.title + " buiten bedrijf gesteld" 
      } else {
        description = this.props.object.title + " in toestand '" + newState + "' gezet"
      }

      return description;
  }

  getUserDescription() {
    var description = '';
    if(Meteor.user().emails && Meteor.user().emails.length>0 && Meteor.user().emails[0].address) {
      description=Meteor.user().emails[0].address;
    } else {
      description = 'id:' + meteor.userId();
    }

    return description;
  }

  setObjectReserved() {
    var newState = 'reserved';
    var user = this.getUserDescription();
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), newState, user);

    var description = this.getStateChangeNeatDescription(newState);
    Meteor.call('transactions.changeStateForObject', newState, description, this.props.object._id, this.props.object.locationId);    
  }

  setObjectInUse() {
    var newState = 'inuse'
    var user = this.getUserDescription();
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), newState, user);

    var description = this.getStateChangeNeatDescription(newState);
    Meteor.call('transactions.changeStateForObject', newState, description, this.props.object._id, this.props.object.locationId);    
  }

  setObjectAvailable() {
    var newState = 'available'
    Meteor.call('objects.setState', this.props.object._id, null, newState, '');

    var description = this.getStateChangeNeatDescription(newState);
    Meteor.call('transactions.changeStateForObject', newState, description, this.props.object._id, this.props.object.locationId);    
  }

  setObjectOutOfOrder() {
    var newState = 'outoforder'
    var user = this.getUserDescription();
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), newState, user);

    var description = this.getStateChangeNeatDescription(newState);
    Meteor.call('transactions.changeStateForObject', newState, description, this.props.object._id, this.props.object.locationId);    
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
