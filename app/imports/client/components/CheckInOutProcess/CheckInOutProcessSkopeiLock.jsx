import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import CheckInOutProcessBase from '../CheckInOutProcess/CheckInOutProcessBase';
import { StyleProvider } from '../../StyleProvider.js'
import { getUserDescription } from '/imports/api/users.js';

// Import components
import Button from '../Button/Button';

class CheckInOutProcessSkopeiLock extends CheckInOutProcessBase {
  constructor(props) {
    super(props);
  }

  rentBicycle() {
    Meteor.call('skopei.rentbike', this.props.object._id, this.props.locationId, (error, result) => {
      if(error) {
        Meteor.call('log.write', 'unable to call skopei.rentbike method',error);
      }
    })
  }

  endRentBicycle() {
    Meteor.call('skopei.endrentbike', this.props.object._id, this.props.locationId, (error, result) => {
      if(error) {
        Meteor.call('log.write', 'unable to call skopei.endrentbike method',error);
      }
    })
  }

  getNeatEndTime() {
    var enddate = new Date(this.props.object.state.rentalInfo.dateend);
    return enddate.toLocaleTimeString('nl-NL', { hour: '2-digit', minute:'2-digit', hour12: false });
  }

  renderButtonsForUser() {
    return (
      <div style={s.base}>
        {this.props.object.state.state=='available' ?
          <Button onClick={() => this.rentBicycle() } buttonStyle="hugeSmallerFont">HUUR</Button> : <div /> }
        {this.props.object.state.state=='inuse' ?
          <div>
            <ul style={s.list}>
              {/*}<li style={s.listitem, s.mediumFont}>{this.props.object.description}</li>*/}
              <li style={s.listitem, s.mediumFont}>PINCODE</li>
              <li style={s.listitem, s.largeFont}>{this.props.object.state.rentalInfo.pincode}</li>
              <li style={s.listitem}>Uw huurperiode loopt tot {this.getNeatEndTime()} uur.</li>
            </ul>
            <Button style={s.button} onClick={() => this.endRentBicycle() } buttonStyle="hugeSmallerFont">EINDE VERHUUR</Button>
          </div>
          : <div /> }
        {this.props.object.state.state=='outoforder' ?
            <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="hugeSmallerFont">STEL IN BEDRIJF</Button>
          : <div /> }
      </div>
    );
  }
}

var s = StyleProvider.getInstance().checkInOutProcess;

CheckInOutProcessSkopeiLock.propTypes = {
  locationId: PropTypes.string,
  object: PropTypes.object,
  isProvider: PropTypes.any
};

CheckInOutProcessSkopeiLock.defaultProps = {
  locationId: null,
  object: null,
  isProvider: false
}

export default CheckInOutProcessSkopeiLock;
