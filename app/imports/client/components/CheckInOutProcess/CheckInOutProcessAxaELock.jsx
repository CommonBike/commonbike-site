import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import CheckInOutProcessBase from '../CheckInOutProcess/CheckInOutProcessBase';
import { StyleProvider } from '../../StyleProvider.js'

// Import components
import Button from '../Button/Button';

class CheckInOutProcessAxaELock extends CheckInOutProcessBase {
  constructor(props) {
    super(props);
  }

  renderButtonsForUser() {
    return (
      <div style={s.base}>
      {this.props.object.state.state=='available' ?
        <Button onClick={() => this.setObjectReserved() } buttonStyle="hugeSmallerFont">Reserveer</Button> : <div /> }
      {this.props.object.state.state=='reserved' ? 
        <div style={s.base}>
          <ul style={s.list}>
            <li style={s.listitem}>Uw fiets ophalen?</li>
            <li style={s.listitem}>Uw huurfiets is uitgerust met een electronisch slot</li>
            <li style={s.listitem}>Zoek in het verhuurrek naar {this.props.object.description}</li>
            <li style={s.listitem}>U kunt het fietsslot als volgt bedienen:</li>
            <li style={s.listitem}>Ga in de buurt van de fiets staan</li>
            <li style={s.listitem}>Schakel bluetooth in op uw smartphone</li>
            <li style={s.listitem}>Verbind met apparaat <b>{this.props.object.lock.settings.connectionname}</b></li>
            <li style={s.listitem}>Gebruik pincode <b>{this.props.object.lock.settings.pincode}</b></li>
            <li style={s.listitem}>De verbinding met het slot wordt nu tot stand gebracht</li>
            <li style={s.listitem}>Druk hieronder op de knop <b>OPEN SLOT</b></li>
          </ul>
          <Button style={s.button} onClick={() => { this.setObjectInUse();this.openLock() } } buttonStyle="hugeSmallerFont">Open Slot</Button>
          <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="hugeSmallerFont">Annuleer Reservering</Button>
      </div>
      : <div /> }
      {this.props.object.state.state=='inuse' ? 
        <div>
          <Button style={s.button} onClick={() => this.openLock() } buttonStyle="hugeSmallerFont">Open Slot</Button>
          <ul style={s.list}>
            <li style={s.listitem}>Slot openen?</li>
            <li style={s.listitem}>Uw huurfiets is uitgerust met een electronisch slot</li>
            <li style={s.listitem}>U kunt het fietsslot als volgt bedienen:</li>
            <li style={s.listitem}>Ga in de buurt van de fiets staan</li>
            <li style={s.listitem}>Schakel bluetooth in op uw smartphone</li>
            <li style={s.listitem}>Wacht tot uw smartphone verbonden is met apparaat <b>{this.props.object.lock.settings.connectionname}</b></li>
            <li style={s.listitem}>(Gebruik eventueel pincode <b>{this.props.object.lock.settings.pincode})</b></li>
            <li style={s.listitem}>Druk hierboven op de knop <b>Open Slot</b></li>
          </ul>
          <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="hugeSmallerFont">Ingeleverd</Button> 
          <ul style={s.list}>
            <li style={s.listitem}>Uw fiets inleveren?</li>
            <li style={s.listitem}>Plaats uw fiets in het verhuurrek en zet deze op slot</li>
            <li style={s.listitem}>Druk hierboven op de knop <b>Ingeleverd</b></li>
          </ul>
        </div>
        : <div /> }
      {this.props.object.state.state=='outoforder' ? 
          <Button onClick={() => this.setObjectAvailable() } buttonStyle="hugeSmallerFont">Maak Beschikbaar</Button> 
        : <div /> }
      </div>
    );
  }
}

var s = StyleProvider.getInstance().checkInOutProcess;

CheckInOutProcessAxaELock.propTypes = {
  locationId: PropTypes.string,
  object: PropTypes.object,
  isProvider: PropTypes.any
};

CheckInOutProcessAxaELock.defaultProps = {
  locationId: null,
  object: null,
  isProvider: false
}

export default CheckInOutProcessAxaELock;
