import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import CheckInOutProcessBase from '../CheckInOutProcess/CheckInOutProcessBase';
import { StyleProvider } from '../../StyleProvider.js'
import { getUserDescription } from '/imports/api/users.js';
// Import components
import Button from '../Button/Button';

class CheckInOutProcessOpenBikelocker extends CheckInOutProcessBase {

  constructor(props) {
    super(props);
  }

  validStates() {
    var validStates = [
      "r_rentstart",
      "r_opendoor",
      "r_outoforder",
      "r_available",
      "inuse",
      "available",
      "outoforder"];
    return validStates;
  }

  renderButtonsForProvider() {
    return (
      <div>
        { this.props.object.state.state=="r_rentstart" ||
          this.props.object.state.state=="r_opendoor" ||
          this.props.object.state.state=="r_outoforder" ?
          <Button onClick={() => this.setObjectState("r_available") } buttonStyle="hugeSmallerFont">ANNULEER</Button>: <div /> }
        { this.props.object.state.state=="outoforder" ?
          <Button onClick={() => this.setObjectState("r_available") } buttonStyle="hugeSmallerFont">STEL IN BEDRIJF</Button>: <div /> }
        { this.props.object.state.state=="inuse" ?
          <Button onClick={() => this.setObjectState("r_available") } buttonStyle="hugeSmallerFont">GEEF VRIJ</Button>: <div /> }
        { this.props.object.state.state=="available" ?
          <Button onClick={() => this.setObjectState("r_outoforder") } buttonStyle="hugeSmallerFont">STEL BUITEN BEDRIJF</Button>: <div /> }
        { this.props.object.state.state=="r_available" ?
          <Button onClick={() => this.setObjectState("available") } buttonStyle="hugeSmallerFont">ANNULEER</Button>: <div /> }
      </div>)
  }

  rentLocker() {
    newState="r_rentstart";

    if(!this.validStates().includes(newState)) {
      return;
    }

    var rentalInfo = {
      'cardhash': '00000000',
      'pincode': ''
    };
    var user = getUserDescription(Meteor.user());
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), this.props.object.locationId,newState, user, rentalInfo);

    Meteor.call('dialoutapi.wakeupcall', this.props.object._id);
  }

  setObjectState(newState) {
    super.setObjectState(newState);

    Meteor.call('dialoutapi.wakeupcall', this.props.object._id);
  }

  renderButtonsForUser() {
    return (
      <div>
        {this.props.object.state.state=="available" ?
          <Button style={s.button} onClick={() => this.rentLocker() } buttonStyle="hugeSmallerFont">HUUR</Button> : <div /> }
        {this.props.object.state.state=="r_rentstart" ?
          <div>
            <ul style={s.list}>
              <li style={s.listitem,s.mediumFont}>CONTROLEREN</li>
              <li style={s.listitem,s.mediumFont}>BESCHIKBAARHEID</li>
            </ul>
            <Button onClick={() => this.setObjectState("available") } buttonStyle="hugeSmallerFont">ANNULEER</Button>
          </div>: <div /> }
        {this.props.object.state.state=="inuse" ?
          <div>
            <ul style={s.list}>
              <li style={s.listitem,s.mediumFont}>PINCODE</li>
              <li style={s.listitem,s.largeFont}><b>{this.props.object.state.rentalInfo.pincode}</b></li>
            </ul>
            <Button onClick={() => this.setObjectState("r_available") } buttonStyle="hugeSmallerFont">ANNULEER</Button>
          </div>: <div /> }
        {this.props.object.state.state=="r_available" ?
            <div>
              <ul style={s.list}>
                <li style={s.listitem,s.mediumFont}>CONTROLEREN</li>
                <li style={s.listitem,s.mediumFont}>TRANSACTIE</li>
              </ul>
              <Button onClick={() => this.setObjectState("available") } buttonStyle="hugeSmallerFont">ANNULEER</Button>
            </div> : <div /> }
      </div>
    );
  }
}

var s = StyleProvider.getInstance().checkInOutProcess;

CheckInOutProcessOpenBikelocker.propTypes = {
  locationId: PropTypes.string,
  object: PropTypes.object,
  isProvider: PropTypes.any
};

CheckInOutProcessOpenBikelocker.defaultProps = {
  locationId: null,
  object: null,
  isProvider: false
}

export default CheckInOutProcessOpenBikelocker;
