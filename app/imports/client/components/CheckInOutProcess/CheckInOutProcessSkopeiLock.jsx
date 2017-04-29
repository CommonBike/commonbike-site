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
          <Button onClick={() => this.rentBicycle() } buttonStyle="hugeSmallerFont">Huur</Button> : <div /> }
        {this.props.object.state.state=='inuse' ? 
          <div>
            <ul style={s.list}>
              <li style={s.listitem}>Uw huurperiode loopt tot {this.getNeatEndTime()} uur.</li>
              <li style={s.listitem}>Uw fiets openen?</li>
              <li style={s.listitem}>Uw huurfiets is voorzien van een Skopei e-Lock</li>
              <li style={s.listitem}>Zoek in het verhuurrek naar {this.props.object.description}</li>
              <li style={s.listitem}>Open het fietsslot door de code <b>{this.props.object.state.rentalInfo.pincode}</b> in te voeren.</li>
              <li style={s.listitem}>Uw huurfiets weer inleveren?</li>
              <li style={s.listitem}>Sluit het slot op de fiets en druk op onderstaande knop</li>
            </ul>
            <Button style={s.button} onClick={() => this.endRentBicycle() } buttonStyle="hugeSmallerFont">Einde verhuur</Button>
          </div>
          : <div /> }
        {this.props.object.state.state=='outoforder' ? 
            <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="hugeSmallerFont">Maak Beschikbaar</Button> 
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
