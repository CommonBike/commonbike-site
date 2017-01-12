import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {propTypes} from 'react-router';
import CheckInOutProcessBase from '../CheckInOutProcess/CheckInOutProcessBase';

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
        <Button style={s.button} onClick={() => this.setObjectReserved() } buttonStyle="huge">Reserveer!</Button> : <div /> }
      {this.props.object.state.state=='reserved' ? 
        <div style={s.base}>
          <ul style={s.list}>
            <li style={s.listitem}>U kunt uw fiets stallen in </li>
            <li style={s.listitem}><b>{this.props.object.title}</b></li>
            <li style={s.listitem}><b>({this.props.object.description})</b></li>
            <li style={s.listitem}><img style={s.image} src="/files/Testdata/locker.png" /></li>
            <li style={s.listitem}>U kunt de fietskluis als volgt openen:</li>
            <li style={s.listitem}>Type <b>{this.props.object.lock.settings.pickupcode}</b></li>
            <li style={s.listitem}>en druk op de groene knop</li>
            <li style={s.listitem}>Zodra de signaallamp groen oplicht</li>
            <li style={s.listitem}>kunt u de kluisdeur ontgrendelen</li>
            <li style={s.listitem}>Plaats nu uw fiets en zet deze op slot</li>
            <li style={s.listitem}>Vergrendel nu de kluisdeur</li>
          </ul>
          <Button style={s.button} onClick={() => this.setObjectInUse() } buttonStyle="huge">FIETS IS GESTALD</Button>
          <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="huge">Annuleer Reservering!</Button>
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
          <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="huge">FIETS IS VERWIJDERD</Button> 
        </div>
        : <div /> }
      {this.props.object.state.state=='outoforder' ? 
          <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="huge">Maak beschikbaar!</Button> 
        : <div /> }
      </div>
    );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    padding: '20px 20px 0 20px',
    textAlign: 'center',
    minHeight: 'calc(100vh - 66px)',
  },

  button: {
    display: 'block'
  },

  list: {
    margin: '0 auto',
    textAlign: 'center',
    listStyle: 'none',
  },

  listitem: {
    padding: '0 10px 0 0',
    margin: '0 auto',
    textAlign: 'center',
    minHeight: '40px',
    fontSize: '1.2em',
    fontWeight: '500',
    listStyle: 'none',
  },

  image: {
    padding: '20px 20px 0 20px',
    textAlign: 'center',
    maxHeight: '250px',
  }
}

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
