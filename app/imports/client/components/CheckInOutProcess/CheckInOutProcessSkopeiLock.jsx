import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import CheckInOutProcessBase from '../CheckInOutProcess/CheckInOutProcessBase';
import { StyleProvider } from '../../StyleProvider.js'


// Import components
import Button from '../Button/Button';

class CheckInOutProcessSkopeiLock extends CheckInOutProcessBase {
  constructor(props) {
    super(props);
  }

  renderButtonsForUser() {
    return (
      <div style={s.base}>
      {this.props.object.state.state=='available' ?
        <Button onClick={() => this.setObjectInUse() } buttonStyle="hugeSmallerFont">Huur</Button> : <div /> }
      {this.props.object.state.state=='inuse' ? 
        <div style={s.base}>
          <ul style={s.list}>
            <li style={s.listitem}>Uw fiets openen?</li>
            <li style={s.listitem}>Uw huurfiets is voorzien van een Skopei e-Lock</li>
            <li style={s.listitem}>Zoek in het verhuurrek naar {this.props.object.description}</li>
            <li style={s.listitem}>Open het fietsslot door de code </li>
            <li style={s.listitem}><b>{this.props.object.lock.settings.keyid}</b></li>
            <li style={s.listitem}>in te voeren.</li>
            <li style={s.listitem}>Uw huurfiets weer inleveren?</li>
            <li style={s.listitem}>Sluit het slot op de fiets en druk op onderstaande knop</li>
          </ul>
          <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="hugeSmallerFont">Einde verhuur</Button>
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
