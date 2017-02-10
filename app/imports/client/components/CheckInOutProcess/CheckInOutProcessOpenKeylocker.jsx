import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import CheckInOutProcessBase from '../CheckInOutProcess/CheckInOutProcessBase';
import { StyleProvider } from '../../StyleProvider.js'


// Import components
import Button from '../Button/Button';

class CheckInOutProcessOpenKeylocker extends CheckInOutProcessBase {
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
            <li style={s.listitem}>De sleutel van uw huurfiets bevindt zich in </li>
            <li style={s.listitem}><b>sleutelkluis {this.props.object.lock.settings.keylocker}</b></li>
            <li style={s.listitem}><img style={s.image} src="/files/Testdata/keylocker_02.jpg" /></li>
            <li style={s.listitem}>U kunt de sleutelkluis als volgt openen:</li>
            <li style={s.listitem}>Druk op Clear</li>
            <li style={s.listitem}>Type <b>{this.props.object.lock.settings.pincode}</b></li>
            <li style={s.listitem}>Gebruik de knop <b>OPEN</b> om de kluis te openen</li>
            <li style={s.listitem}>Pak de fietssleutel</li>
            <li style={s.listitem}>Sluit svp de kluis weer goed af</li>
            <li style={s.listitem}>U kunt nu {this.props.object.description} meenemen</li>
          </ul>
          <Button style={s.button} onClick={() => this.setObjectInUse() } buttonStyle="hugeSmallerFont">Sleutel Gepakt</Button>
          <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="hugeSmallerFont">Annuleer Reservering</Button>
        </div>
        : <div /> }
      {this.props.object.state.state=='inuse' ? 
        <div>
          <ul style={s.list}>
            <li style={s.listitem}>Uw huurfiets weer inleveren?</li>
            <li style={s.listitem}>U kunt uw fietssleutel terugplaatsen in</li>
            <li style={s.listitem}><b>sleutelkluis {this.props.object.lock.settings.keylocker}</b></li>
            <li style={s.listitem}><img style={s.image} src="/files/Testdata/keylocker_02.jpg" /></li>
            <li style={s.listitem}>U kunt de sleutelkluis als volgt openen:</li>
            <li style={s.listitem}>Druk op Clear</li>
            <li style={s.listitem}>Type <b>{this.props.object.lock.settings.pincode}</b></li>
            <li style={s.listitem}>Gebruik de knop <b>OPEN</b> om de kluis te openen</li>
            <li style={s.listitem}>Leg de fietssleutel in de kluis</li>
            <li style={s.listitem}>Sluit svp de kluis weer goed af</li>
          </ul>
          <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="hugeSmallerFont">Sleutel Teruggelegd</Button> 
        </div>
        : <div /> }
      {this.props.object.state.state=='outoforder' ? 
          <Button style={s.button}  onClick={() => this.setObjectAvailable() } buttonStyle="hugeSmallerFont">Maak Beschikbaar</Button> 
        : <div /> }
      </div>
    );
  }
}

var s = StyleProvider.getInstance().checkInOutProcess;

CheckInOutProcessOpenKeylocker.propTypes = {
  locationId: PropTypes.string,
  object: PropTypes.object,
  isProvider: PropTypes.any
};

CheckInOutProcessOpenKeylocker.defaultProps = {
  locationId: null,
  object: null,
  isProvider: false
}

export default CheckInOutProcessOpenKeylocker;
