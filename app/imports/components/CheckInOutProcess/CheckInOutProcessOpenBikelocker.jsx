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

  render() {
    if (this.props.isProvider) {
        return this.renderButtonsForProvider();
    } else {
        return this.renderButtonsForUser();      
    }
  }

  renderButtonsForUser() {
    return (
      <div style={s.base}>
      {this.props.object.state.state=='available' ?
        <Button onClick={() => this.setObjectReserved() } buttonStyle="huge">Reserveer!</Button> : <div /> }
      {this.props.object.state.state=='reserved' ? 
        <div style={s.base}>
          <p>VOER CODE {this.props.object.lock.settings.pickupcode} IN OP DE KLUIS OM DE KLUIS TE OPENEN</p>
          <Button style={s.button} onClick={() => this.setObjectInUse() } buttonStyle="huge">FIETS IS GESTALD</Button>
          <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="huge">Annuleer Reservering!</Button>
        </div>
        : <div /> }
      {this.props.object.state.state=='inuse' ? 
        <div>
          <p>VOER CODE {this.props.object.lock.settings.returncode} IN OP DE KLUIS OM DE KLUIS TE OPENEN</p>
          <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="huge">FIETS IS VERWIJDERD</Button> 
        </div>
        : <div /> }
      {this.props.object.state.state=='outoforder' ? 
          <Button onClick={() => this.setObjectAvailable() } buttonStyle="huge">Maak beschikbaar!</Button> 
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
