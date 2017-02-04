import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {propTypes} from 'react-router';
import CheckInOutProcessBase from '../CheckInOutProcess/CheckInOutProcessBase';
import { StyleProvider } from '../../StyleProvider.js'


// Import components
import Button from '../Button/Button';

class CheckInOutProcessOpenBikelocker extends CheckInOutProcessBase {
  constructor(props) {
    super(props);
  }

  renderButtonsForUser() {
    return (
      <div style={s.base}>
      {this.props.object.state.state=='available' ?
        <Button style={s.button} onClick={() => this.setObjectReserved() } buttonStyle="hugeSmallerFont">Reserveer</Button> : <div /> }
      {this.props.object.state.state=='reserved' ? 
        <div style={s.base}>
          <ul style={s.list}>
            <li style={s.listitem}>U kunt uw fiets stallen in </li>
            <li style={s.listitem}><b>{this.props.object.title}</b></li>
            <li style={s.listitem}><b>({this.props.object.description})</b></li>
            <li style={s.listitem}><img style={s.image} src="/files/Testdata/locker.png" /></li>
            <li style={s.listitem}>U kunt de fietskluis als volgt openen:</li>
            <li style={s.listitem}>Type <b>{this.props.object.lock.settings.keyid}</b></li>
            <li style={s.listitem}>en druk op de groene knop</li>
            <li style={s.listitem}>Zodra de signaallamp groen oplicht</li>
            <li style={s.listitem}>kunt u de kluisdeur ontgrendelen</li>
            <li style={s.listitem}>Plaats nu uw fiets en zet deze op slot</li>
            <li style={s.listitem}>Vergrendel nu de kluisdeur</li>
          </ul>
          <Button style={s.button} onClick={() => this.setObjectInUse() } buttonStyle="hugeSmallerFont">Fiets Gestald</Button>
          <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="hugeSmallerFont">Annuleer Reservering</Button>
        </div>
        : <div /> }
      {this.props.object.state.state=='inuse' ? 
        <div style={s.base}>
          <ul style={s.list}>
            <li style={s.listitem}>Uw fiets is gestald in</li>
            <li style={s.listitem}><b>{this.props.object.title}</b></li>
            <li style={s.listitem}><b>({this.props.object.description})</b></li>
            <li style={s.listitem}><img style={s.image} src="/files/Testdata/locker.png" /></li>
            <li style={s.listitem}>U kunt de fietskluis als volgt openen:</li>
            <li style={s.listitem}>Type <b>{this.props.object.lock.settings.returncode}</b></li>
            <li style={s.listitem}>en druk op de groene knop</li>
            <li style={s.listitem}>Zodra de signaallamp groen oplicht</li>
            <li style={s.listitem}>kunt u de kluisdeur ontgrendelen</li>
            <li style={s.listitem}>Haal nu de fiets uit de kluis</li>
            <li style={s.listitem}>Wilt u alstublieft de kluisdeur weer sluiten?</li>
          </ul>
          <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="hugeSmallerFont">Fiets Verwijderd</Button> 
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
